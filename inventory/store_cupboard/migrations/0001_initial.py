# Generated by Django 3.1 on 2020-08-20 12:25

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CleaningInventory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('item_text', models.CharField(max_length=200)),
                ('quantity', models.IntegerField(default=0)),
                ('purchase_date', models.DateField(verbose_name='date purchased')),
            ],
        ),
        migrations.CreateModel(
            name='FoodInventory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('item_text', models.CharField(max_length=200)),
                ('item_weight', models.CharField(max_length=6)),
                ('quantity', models.IntegerField(default=0)),
                ('purchase_date', models.DateField(verbose_name='date purchased')),
                ('opened_date', models.DateField(verbose_name='date purchased')),
                ('expiration_date', models.DateField(verbose_name='date expires')),
            ],
        ),
    ]