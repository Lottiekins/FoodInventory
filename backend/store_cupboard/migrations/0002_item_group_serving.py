# Generated by Django 3.1 on 2020-09-07 22:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store_cupboard', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='group_serving',
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
    ]
