# Generated by Django 3.0.6 on 2020-05-26 12:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='userfilter',
            name='date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='userfilter',
            name='name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
