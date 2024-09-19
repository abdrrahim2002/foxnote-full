from django import forms 
from .models import note, tags
from django.forms import modelformset_factory


class tagsForm(forms.ModelForm):
    
  class Meta:
    model = tags
    fields = ('tag',)




class noteForm(forms.ModelForm):
  
  class Meta:
    model = note
    fields = ('title', 'tag')

  def __init__(self, *args, **kwargs):
    profile = kwargs.pop('profile', None)  # Get the profile from kwargs
    print(f"Profile in form: {profile}")  # Debugging line to check profile
    super().__init__(*args, **kwargs)

    # Filter tags by the user's profile
    if profile:
      self.fields['tag'].queryset = tags.objects.filter(profile=profile).order_by('tag')


TagFormSet = modelformset_factory(tags, form=tagsForm, extra=1)