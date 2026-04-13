"""add_payment_amount_to_appointments

Revision ID: 390b51724913
Revises: db6e37b46483
Create Date: 2026-04-13 04:41:02.609567

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '390b51724913'
down_revision: Union[str, None] = 'db6e37b46483'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add payment_amount column to appointments table
    op.add_column('appointments', sa.Column('payment_amount', sa.Integer(), nullable=True, default=0))


def downgrade() -> None:
    # Remove payment_amount column from appointments table
    op.drop_column('appointments', 'payment_amount')
