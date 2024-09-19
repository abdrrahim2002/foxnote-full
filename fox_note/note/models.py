from django.db import models
from profile_auth.models import Profile
from django.utils import timezone
# Create your models here.

class tags(models.Model):
  profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
  tag = models.CharField(max_length=200)


  class Meta:
    unique_together = ('profile', 'tag')  # Ensure unique tags per profile more details ensures that each user (Profile) can only have unique tags. It allows for efficient querying and prevents inconsistent data where the same tag is associated with the same user multiple times. in resume don't allow the profile to have same 2 tags the same tag can create twis by the same profile to avoide duplication


  def __str__(self):
    return self.tag

class colors(models.Model):
  profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
  color = models.CharField(max_length=7, default='white') #hex color\

  class Meta:
    unique_together = ('profile', 'color') #ensure that the profile can use the color in multiple note and it can't be created twice no dublocation in the database


  def __str__(self):
    return self.color

class note(models.Model):
  profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
  title = models.CharField(max_length=300)
  tag = models.ManyToManyField(tags)
  content = models.TextField()
  creation_date = models.DateTimeField(default=timezone.now)
  color = models.ForeignKey(colors, on_delete=models.CASCADE)

  def __str__(self):
    return self.title