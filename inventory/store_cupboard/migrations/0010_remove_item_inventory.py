# Generated by Django 3.1 on 2020-08-20 19:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('store_cupboard', '0009_auto_20200820_2029'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='item',
            name='inventory',
        ),
    ]
