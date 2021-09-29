from .common import *

#------------------
def csv_read(file) :
#------------------
	csv_bin = []
	with open(file) as csvfile:
		reader = csv.DictReader(csvfile)
		for row in reader :
			csv_bin.append(row)
	return csv_bin


# -----------
def load_data(fileid) :
# -----------
	dobj = WorkFile.objects.get(id=fileid)    
	filename, file_extension = os.path.splitext(dobj.file.path)
	contents =[]
	if ".CSV" == file_extension.upper() :
		contents = csv_read(dobj.file.path)
	try:
		os.remove(dobj.file.path) 
	except:
		pass   
	dobj.delete()
	return contents	

