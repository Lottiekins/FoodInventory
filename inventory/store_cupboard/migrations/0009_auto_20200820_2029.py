# Generated by Django 3.1 on 2020-08-20 19:29

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('store_cupboard', '0008_auto_20200820_2028'),
    ]

    operations = [
        migrations.AlterField(
            model_name='inventoryitem',
            name='expiration_date',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='inventoryitem',
            name='opened_date',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='inventoryitem',
            name='purchase_date',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
