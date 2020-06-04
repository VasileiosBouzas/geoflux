# Generated by Django 3.0.6 on 2020-06-04 11:50

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('asmfa', '0019_auto_20200604_1150'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('login', '0003_auto_20200604_0907'),
    ]

    operations = [
        migrations.CreateModel(
            name='DatasetInUser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dataset', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='asmfa.Dataset')),
            ],
        ),
        migrations.CreateModel(
            name='UserDataset',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datasets', models.ManyToManyField(through='login.DatasetInUser', to='asmfa.Dataset')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.RemoveField(
            model_name='userpublication',
            name='publications',
        ),
        migrations.RemoveField(
            model_name='userpublication',
            name='user',
        ),
        migrations.DeleteModel(
            name='PublicationInUser',
        ),
        migrations.DeleteModel(
            name='UserPublication',
        ),
        migrations.AddField(
            model_name='datasetinuser',
            name='userdataset',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='login.UserDataset'),
        ),
    ]
