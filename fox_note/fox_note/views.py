from django.shortcuts import redirect


#if visiting the domain name if the user is new it will redirect him to the home page else if he have account it will redirect hime to his account
def redirect_view(request):
  return redirect('/home/')