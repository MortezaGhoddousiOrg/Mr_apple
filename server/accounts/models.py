from django.db import models

# Create your models here.

class Users(models.Model):
    id = models.AutoField(primary_key=True)
    firstname = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.CharField(max_length=255, null=True, blank=True)
    role = models.CharField(max_length=50)
    status = models.CharField(max_length=50, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.phone

