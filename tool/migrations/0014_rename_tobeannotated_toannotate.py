# Generated by Django 4.2.11 on 2024-05-11 19:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tool', '0013_rename_annotation_tobeannotated_annotatedimage'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='tobeAnnotated',
            new_name='ToAnnotate',
        ),
    ]