# Generated by Django 4.2.11 on 2024-05-26 19:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tool', '0026_remove_photo_image_objects_alter_object_photo'),
    ]

    operations = [
        migrations.AddField(
            model_name='annotatedimage',
            name='object',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='tool.object'),
        ),
    ]
