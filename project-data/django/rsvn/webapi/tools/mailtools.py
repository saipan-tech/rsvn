# Send an HTML email with an embedded image and a plain text message for
# email clients that don't want to display the HTML.
import smtplib
import datetime

from email.mime.text  import MIMEText
from email.mime.image  import MIMEImage
from email.mime.multipart import MIMEMultipart

from config import Sysconf


#----------------------------------
def multimail(strFrom,strTo,subject,text,html) :
#----------------------------------
		

	# 	Send an HTML email with an embedded image and a plain text message for
	# 	email clients that don't want to display the HTML.

	# 	Define these once; use them twice!
	#	strFrom = 'from@example.com'
	#	strTo = 'to@example.com'
	# 	Create the root message and fill in the from, to, and subject headers
	
	msgRoot = MIMEMultipart('related')
	msgRoot['Subject'] = subject
	msgRoot['From'] = strFrom
	msgRoot['To'] = strTo
	msgRoot.preamble = 'This is a multi-part message in MIME format.'

	# Encapsulate the plain and HTML versions of the message body in an
	# 'alternative' part, so message agents can decide which they want to display.
	msgAlternative = MIMEMultipart('alternative')
	msgRoot.attach(msgAlternative)

	msgText = MIMEText(text,'text')
	msgAlternative.attach(msgText)

	# We reference the image in the IMG SRC attribute by the ID we give it below
	msgText = MIMEText(html, 'html')
	msgAlternative.attach(msgText)

	# This example assumes the image is in the current directory
	fp = open('static/img/MCA.jpg', 'rb')
	msgImage = MIMEImage(fp.read())
	fp.close()

	# Define the image's ID as referenced above
	msgImage.add_header('Content-ID', '<image1>')
	msgRoot.attach(msgImage)

	s = smtplib.SMTP()
	s.connect("mail.saipantech.com",587)
	s.login('jc@saipantech.com','pimil210')
	s.sendmail( strFrom, strTo, msgRoot.as_string() )
	s.quit()

#=======================================================
class MailMessage(object) :
#=======================================================
	config = Sysconf()
	#--------------------------------
	heading = """
		<!doctype><html><head><meta charset="UTF-8"></head>
		<body>
		<img src="cid:image1">
		<hr>
		"""
	footer =  "</body></html>"	
	body = ""
	subject = ""
	strTo = ""
	strFrom = ""
	text = ""
	
	#--------------------------------
	def dmp(self) :
		html = self.heading+self.body+self.footer
		return {
			'footer': self.footer,	
			'body': self.body,
			'subject' : self.subject,
			'strTo' : self.strTo,
			'strFrom' : self.strFrom,
			'text' :  self.text
		}		
	#--------------------------------
	def execute(self) :
		html = self.heading+self.body+self.footer
		multimail(self.strFrom,self.strTo,
				self.subject,self.text, html)
	#--------------------------------
	def test_execute(self) :
		html = self.heading+self.body+self.footer
		multimail(self.strFrom,"jc@mcsaipan.net",
				self.subject,self.text, html)

	#--------------------------------
	# just need body and subject
	def send_to_admin(self) :
		html = self.heading+self.body+self.footer
		multimail(self.config.system_email,self.config.admin_email,
					self.subject,"Internal Record", html)

#=======================================================
def mailserver1() :
#=======================================================
	s = smtplib.SMTP()
	s.connect("mail.saipantech.com",587)
	s.login('jc@saipantech.com','pimil210')
	return s
#=======================================================
def _mailbox(ffrom,tto,subject,text,html) :
#=======================================================
	msg = MIMEMultipart("alternative")
	msg['Subject'] 	= subject
	msg['From'] 		= ffrom
	msg['To'] 			= tto
	msg.attach(MIMEText(text,"plain"))
	msg.attach(MIMEText(html, "html"))
	s = mailserver1()
	s.sendmail( ffrom, tto, msg.as_string() )
	s.quit()
#=======================================================
def mailbox(username,subject,text,html) :
#=======================================================
	cfg = Sysconf()
	_mailbox(cfg.system_email,username,subject,text,html )

#=======================================================
def email_reset_password(username,temp_key) :
#=======================================================
	cfg = Sysconf()
	html =	"""\
		<!doctype html><html><head><meta charset="UTF-8">
			<body>
					<h3>Password Reset</h3>                                               
					Dear {},<br><br>
					<p>You have received this email in order to manage your password
							on the Mount Carmel School Admissions Portal.</p>
					<p>Please click the link below to  open up a password reset page </p>
					<a href='http://{}/verification/{}/{}'>click here</a> 
					<p>Thank you, from the Mount Carmel Team
			</body>
		</html>
		
		""".format(username,cfg.main_url,username,temp_key)
	subject= "Mount Carmel Admissions Portal Password Reset"

	text = "Here is the text version: please click http://{}/verification/{}/{}".format(cfg.main_url,username,temp_key)

	mailbox(username,subject,text,html)
#----------------------------------
def msg_received_ack(msg) :
#----------------------------------
	html =	"""\
		<!doctype html>
		<html>
			<body>
				<h3>Message Acknowledgement</h3>
					Dear {} {},
					<br><br>
					<p>We have received your message and will be working to resolve any issues.</p>
					<hr><p> {}</p><hr>
					<br>
					<p>Thank you, from the Mount Carmel Team</p>
			</body>	
		</html> """.format(msg.first_name, msg.last_name, msg.message)	
	subject= "MCS Admissions Portal Message Received - {}".format(msg.subject)
	text = "Here is the text version: Message Acknowledged"
	mailbox(msg.email,subject,text,html)

