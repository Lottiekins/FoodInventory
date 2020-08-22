# Generated by Django 3.1 on 2020-08-20 19:28

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('store_cupboard', '0007_auto_20200820_2027'),
    ]

    operations = [
        migrations.AlterField(
            model_name='inventoryitem',
            name='expiration_date',
            field=models.DateTimeField(default=datetime.datetime(2020, 8, 20, 19, 28, 44, 862620, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='inventoryitem',
            name='opened_date',
            field=models.DateTimeField(default=datetime.datetime(2020, 8, 20, 19, 28, 44, 862620, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='inventoryitem',
            name='purchase_date',
            field=models.DateTimeField(default=datetime.datetime(2020, 8, 20, 19, 28, 44, 862620, tzinfo=utc)),
        ),
    ]