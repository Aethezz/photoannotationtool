# Generated by Django 4.2.11 on 2024-05-17 02:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tool', '0018_annotatedimage_annotated_image_annotatedimage_height_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='annotatedimage',
            name='photo',
        ),
    ]
