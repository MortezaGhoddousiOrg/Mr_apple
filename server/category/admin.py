from django.contrib import admin

from category.models import CategoryChild, CategoryParent

# Register your models here.

admin.site.register(CategoryParent)
admin.site.register(CategoryChild)