# Generated by Django 4.2.11 on 2024-05-19 20:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tool', '0020_alter_annotatedimage_annotated_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='annotatedimage',
            name='photo',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='tool.photo'),
        ),
    ]
