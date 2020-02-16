from django.shortcuts import render
from django.http import HttpResponse
from django.utils.html import escape
import json

def recorder(request):
    return render(request,"record/recording.html")
def upload(request):
    if request.method == 'POST':
        print("Test")
    # obviously handle correct naming of the file and place it somewhere like media/uploads/
        uploadedFile = open("recording.txt", "wb")
    # the actual file is in request.body
        uploadedFile.write("Awesome!")
        uploadedFile.close()
    # put additional logic like creating a model instance or something like this here