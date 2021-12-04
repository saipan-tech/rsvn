# Send an HTML email with an embedded image and a plain text message for
# email clients that don't want to display the HTML.
import smtplib
import datetime

from email.mime.text  import MIMEText
from email.mime.image  import MIMEImage
from email.mime.multipart import MIMEMultipart
import os
from rsvn.settings import BASE_DIR

email_from = "admin@saipantech.com"
verify_server = "http://rigel.saipantech.com:9000"



#----------------------------------
class PostOffice(object) :
#----------------------------------
	def __init__(self,data) :
		
		# bring in the data from api
		self.Subject  = ""
		self.From 	  =	'admin@rsvnsystem.com'
		self.Text     = ''
		self.Html     = ''
		self.VerifyServer = "http://rigel.saipantech.com:9000"
		try:
			self.Username = data['Username']
			self.To  	  = data['To']
			self.Token    = data['Token']
		except:
			print("testing")
			return

		self.html_msg()
		self.multimail()

	def html_msg(self) :
		self.Html =	"""
			<!doctype><html><head><meta charset="UTF-8"></head>
			<body>
			<img src="cid:image1">
			<hr>
			<h3>Password Reset</h3>                                               
			Dear {},<br><br>
			<p>You have received this email in order to manage your password
					on the RSVN Reservation System .</p>
			<p>Please click the link below to  open up a password reset page </p>
			<a href="{}/verify?token={}">click here</a> 
			<p>Thank you, from the RSVN System Team
			</body>
			</html>
			""".format(self.Username,self.VerifyServer,self.Token)
		self.Subject= "RSVN Password Reset"
		self.Text = "Here is the text version: to verify RSVN staff ID please click {}/verify?token={}".format(
			self.VerifyServer,self.Token)

	#----------------------------------
	def multimail(self) :
	#----------------------------------
		# Dict

		# from
		# to
		# subject
		# text
		# html

		

		# 	Send an HTML email with an embedded image and a plain text message for
		# 	email clients that don't want to display the HTML.

		# 	Define these once; use them twice!
		#	strFrom = 'from@example.com'
		#	strTo = 'to@example.com'
		# 	Create the root message and fill in the from, to, and subject headers
		msgRoot = MIMEMultipart('related')
		msgRoot['Subject'] = self.Subject
		msgRoot['From'] = self.From
		msgRoot['To'] = self.To
		msgRoot.preamble = 'This is a multi-part message in MIME format.'

		# Encapsulate the plain and HTML versions of the message body in an
		# 'alternative' part, so message agents can decide which they want to display.
		msgAlternative = MIMEMultipart('alternative')
		msgRoot.attach(msgAlternative)

		msgText = MIMEText(self.Text,'text')
		msgAlternative.attach(msgText)

		# We reference the image in the IMG SRC attribute by the ID we give it below
		msgText = MIMEText(self.Html, 'html')
		msgAlternative.attach(msgText)

		# we can make a fix logo
		# This example assumes the image is in the current directory
		STATIC_ROOT = (os.path.join(BASE_DIR,'static'))
		fp = open(f'{STATIC_ROOT}/img/rsvn.jpg', 'rb')
		
		msgImage = MIMEImage(fp.read())
		fp.close()

		# Define the image's ID as referenced above
		msgImage.add_header('Content-ID', '<image1>')
		msgRoot.attach(msgImage)

		s = smtplib.SMTP()
		s.connect("mail.saipantech.com",587)
		s.login('jc@saipantech.com','pimil210')
		s.sendmail( self.From, self.To, msgRoot.as_string() )
		s.quit()




"""
#=======================================================
def mailbox(ffrom,tto,subject,text,html) :
#=======================================================
	msg = MIMEMultipart("alternative")
	msg['Subject'] 	= subject
	msg['From'] 		= ffrom
	msg['To'] 			= tto
	msg.attach(MIMEText(text,"plain"))
	msg.attach(MIMEText(html, "html"))
	s = smtplib.SMTP()
	s.connect("mail.saipantech.com",587)
	s.login('jc@saipantech.com','pimil210')
	s.sendmail( ffrom, tto, msg.as_string() )
	s.quit()
"""