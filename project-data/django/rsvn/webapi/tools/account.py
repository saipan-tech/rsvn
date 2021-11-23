
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

from .mailtools import *
import os, binascii
#----------------------------------------------------
def contact_keygen() :
  return binascii.b2a_hex(os.urandom(int(30))).upper().decode()

def pwd_change(request) :
	result = {}
	error_message = ""
	if "cancel" in request.POST :
		return redirect("login_request")

	if "old_password" in request.POST and "username" in request.POST :
		user = authenticate(username=request.POST['username'],password= request.POST['old_password']) 
		if user is not None:	

			if "password1" in request.POST and "password2" in request.POST:
				if request.POST["password1"] == request.POST["password2"] :
					if " " not in request.POST['password1'] :
						if len(request.POST["password1"]) >7 :
							user.set_password(request.POST['password1'])
							user.save()	
							return redirect("logout_request")
						else:
							error_message = "Password is too short - at least 8 characters"
					else :
						error_message = "No spaces allowed in password"
				else : 
					error_message = "Password Mismatch"
			else : 
				error_message = "Please enter New and Confirm Passwords"
		else : 
			error_message = "Old Password Error"
				
	result["error_msg"] = error_message

	return  render(request,'account/pwd_change.html',context=result)





#==============================================
