import asyncio
from datetime import date, datetime, timedelta

from sqlalchemy import select

from app.db import AsyncSessionLocal, Base, create_tables
from app.modules.auth.models import Doctor
from app.modules.auth.service import hash_password
from app.modules.patients.models import Patient, Consultation, attached_files
from app.modules.appointments.models import Appointment
from app.modules.finance.models import Expense
from app.modules.settings.models import SystemSettings


def _patient_exists(session, email, phone):
    return session.execute(
        select(Patient).where((Patient.email == email) | (Patient.phone == phone))
    )


async def seed_database():
    await create_tables()

    async with AsyncSessionLocal() as session:
        async with session.begin():
            # Seed doctor account
            doctor_email = 'dr.john@example.com'
            result = await session.execute(select(Doctor).where(Doctor.email == doctor_email))
            doctor = result.scalars().first()
            if not doctor:
                doctor = Doctor(
                    fullName='Dr. John Doe',
                    email=doctor_email,
                    hashed_password=hash_password('Password123!'),
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
                session.add(doctor)

            # Seed patients
            patients_data = [
                {
                    'full_name': 'Amina Hassan',
                    'gender': 'Female',
                    'email': 'amina.hassan@example.com',
                    'phone': '+1-202-555-0111',
                    'address': '123 Elm Street',
                    'weight': 65,
                    'height': 168,
                    'date_of_birth': date(1990, 5, 18),
                    'last_visit': date.today() - timedelta(days=5),
                    'created_at': date.today() - timedelta(days=30),
                    'updated_at': date.today() - timedelta(days=5),
                    'blood_type': 'A+',
                    'allergies': 'Penicillin',
                    'chronic_conditions': 'Hypertension',
                    'relationship_status': 'Married',
                    'emergency_contact_name': 'Sam Hassan',
                    'emergency_contact_phone': '+1-202-555-0122',
                },
                {
                    'full_name': 'Miguel Santos',
                    'gender': 'Male',
                    'email': 'miguel.santos@example.com',
                    'phone': '+1-202-555-0133',
                    'address': '78 Oak Avenue',
                    'weight': 82,
                    'height': 175,
                    'date_of_birth': date(1984, 9, 7),
                    'last_visit': date.today() - timedelta(days=2),
                    'created_at': date.today() - timedelta(days=45),
                    'updated_at': date.today() - timedelta(days=2),
                    'blood_type': 'O-',
                    'allergies': 'None',
                    'chronic_conditions': 'None',
                    'relationship_status': 'Single',
                    'emergency_contact_name': 'Ana Santos',
                    'emergency_contact_phone': '+1-202-555-0144',
                },
                {
                    'full_name': 'Sara Kim',
                    'gender': 'Female',
                    'email': 'sara.kim@example.com',
                    'phone': '+1-202-555-0155',
                    'address': '432 Cedar Lane',
                    'weight': 58,
                    'height': 162,
                    'date_of_birth': date(1996, 2, 11),
                    'last_visit': date.today(),
                    'created_at': date.today() - timedelta(days=10),
                    'updated_at': date.today(),
                    'blood_type': 'B+',
                    'allergies': 'Latex',
                    'chronic_conditions': 'Asthma',
                    'relationship_status': 'Single',
                    'emergency_contact_name': 'Jae Kim',
                    'emergency_contact_phone': '+1-202-555-0166',
                },
            ]

            patient_records = []
            for patient_data in patients_data:
                result = await session.execute(
                    select(Patient).where(
                        (Patient.email == patient_data['email']) | (Patient.phone == patient_data['phone'])
                    )
                )
                patient = result.scalars().first()
                if not patient:
                    patient = Patient(**patient_data)
                    session.add(patient)
                    await session.flush()
                patient_records.append(patient)

            # Seed appointments
            appointment_rows = [
                {
                    'patient_id': patient_records[0].id,
                    'time': datetime.combine(date.today(), datetime.min.time()).replace(hour=9, minute=0).isoformat(),
                    'duration': 30,
                    'type': 'Check-up',
                    'payment_amount': 150,
                },
                {
                    'patient_id': patient_records[1].id,
                    'time': datetime.combine(date.today(), datetime.min.time()).replace(hour=11, minute=0).isoformat(),
                    'duration': 45,
                    'type': 'Consultation',
                    'payment_amount': 220,
                },
                {
                    'patient_id': patient_records[2].id,
                    'time': datetime.combine(date.today() + timedelta(days=1), datetime.min.time()).replace(hour=14, minute=30).isoformat(),
                    'duration': 20,
                    'type': 'Follow-up',
                    'payment_amount': 90,
                },
            ]

            for appointment_data in appointment_rows:
                result = await session.execute(
                    select(Appointment).where(
                        Appointment.patient_id == appointment_data['patient_id'],
                        Appointment.time == appointment_data['time']
                    )
                )
                appointment = result.scalars().first()
                if not appointment:
                    session.add(Appointment(**appointment_data))

            # Seed consultations
            consultation_rows = [
                {
                    'patient_id': patient_records[0].id,
                    'doctor_id': doctor.id,
                    'date': datetime.utcnow() - timedelta(days=5, hours=2),
                    'notes': 'Patient reported headaches and mild dizziness.',
                    'main_complaint': 'Headache',
                    'problem_history': 'Two weeks of intermittent pain',
                    'current_medications': 'Ibuprofen',
                    'symptoms_checklist': 'Fever,Pain,Dizziness',
                    'medical_history': 'Hypertension',
                    'family_medical_history': 'Father has diabetes',
                    'diagnosis': 'Tension headache',
                },
                {
                    'patient_id': patient_records[2].id,
                    'doctor_id': doctor.id,
                    'date': datetime.utcnow() - timedelta(days=1, hours=3),
                    'notes': 'Follow-up after asthma episode.',
                    'main_complaint': 'Asthma follow-up',
                    'problem_history': 'Shortness of breath when exercising',
                    'current_medications': 'Inhaler',
                    'symptoms_checklist': 'Cough,Dizziness',
                    'medical_history': 'Asthma',
                    'family_medical_history': 'Mother has asthma',
                    'diagnosis': 'Stable asthma',
                },
            ]

            for consultation_data in consultation_rows:
                result = await session.execute(
                    select(Consultation).where(
                        Consultation.patient_id == consultation_data['patient_id'],
                        Consultation.date == consultation_data['date']
                    )
                )
                consultation = result.scalars().first()
                if not consultation:
                    session.add(Consultation(**consultation_data))

            # Seed expenses
            expense_rows = [
                {
                    'category': 'clinic rent',
                    'amount': 980,
                    'description': 'Monthly clinic rent',
                    'date': date.today().isoformat(),
                },
                {
                    'category': 'medical material',
                    'amount': 320,
                    'description': 'Lab supplies and testing kits',
                    'date': (date.today() - timedelta(days=3)).isoformat(),
                },
            ]

            for expense_data in expense_rows:
                result = await session.execute(
                    select(Expense).where(
                        Expense.category == expense_data['category'],
                        Expense.amount == expense_data['amount'],
                        Expense.date == expense_data['date']
                    )
                )
                expense = result.scalars().first()
                if not expense:
                    session.add(Expense(**expense_data))

            # Seed system settings
            settings_rows = [
                {
                    'key': 'clinic_name',
                    'value': 'MediClinic Central',
                    'value_type': 'string',
                    'description': 'Clinic display name',
                    'category': 'general',
                },
                {
                    'key': 'default_appointment_duration',
                    'value': '30',
                    'value_type': 'integer',
                    'description': 'Default appointment duration in minutes',
                    'category': 'appointments',
                },
                {
                    'key': 'notifications_enabled',
                    'value': 'true',
                    'value_type': 'boolean',
                    'description': 'Enable appointment reminders',
                    'category': 'notifications',
                },
            ]

            for setting_data in settings_rows:
                result = await session.execute(select(SystemSettings).where(SystemSettings.key == setting_data['key']))
                setting = result.scalars().first()
                if not setting:
                    session.add(SystemSettings(**setting_data))

            # Seed attached file records for patient 1
            file_data = {
                'patient_id': patient_records[0].id,
                'file_name': 'Blood_Test_Result.pdf',
                'file_path': '/files/Blood_Test_Result.pdf',
                'file_type': 'application/pdf',
                'created_at': date.today() - timedelta(days=4),
            }
            result = await session.execute(
                select(attached_files).where(
                    attached_files.patient_id == file_data['patient_id'],
                    attached_files.file_name == file_data['file_name'],
                )
            )
            attached = result.scalars().first()
            if not attached:
                session.add(attached_files(**file_data))

        await session.commit()

    print('Seed data inserted successfully.')


if __name__ == '__main__':
    asyncio.run(seed_database())
