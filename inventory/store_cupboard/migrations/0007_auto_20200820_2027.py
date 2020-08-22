# Generated by Django 3.1 on 2020-08-20 19:27

import datetime
from django.db import migrations, models
import django.db.models.deletion
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('store_cupboard', '0006_auto_20200820_2008'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='item',
            name='expiration_date',
        ),
        migrations.RemoveField(
            model_name='item',
            name='opened_date',
        ),
        migrations.RemoveField(
            model_name='item',
            name='purchase_date',
        ),
        migrations.CreateModel(
            name='InventoryItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('expiration_date', models.DateTimeField(default=datetime.datetime(2020, 8, 20, 19, 27, 2, 897442, tzinfo=utc))),
                ('purchase_date', models.DateTimeField(default=datetime.datetime(2020, 8, 20, 19, 27, 2, 897442, tzinfo=utc))),
                ('opened_date', models.DateTimeField(default=datetime.datetime(2020, 8, 20, 19, 27, 2, 897442, tzinfo=utc))),
                ('inventory', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='store_cupboard.inventory')),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='store_cupboard.item')),
            ],
        ),
    ]