# Generated by Django 2.2.8 on 2020-03-17 14:46

import django.contrib.gis.db.models.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('asmfa', '0004_routing'),
    ]

    operations = [
        migrations.AlterField(
            model_name='routing',
            name='geom',
            field=django.contrib.gis.db.models.fields.GeometryField(blank=True, null=True, srid=4326),
        ),
    ]
