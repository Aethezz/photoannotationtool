# Generated by Django 4.2.11 on 2024-05-11 19:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tool', '0014_rename_tobeannotated_toannotate'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='ToAnnotate',
            new_name='job_request',
        ),
    ]