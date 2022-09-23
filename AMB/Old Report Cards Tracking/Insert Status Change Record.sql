INSERT INTO cards_tracking (performer, reference_number, from_status, to_status, created_at, cs_object_id, cardholder_name, card_number)
VALUES (%1, %2, %3, %4, GETDATE(), %5, %6, %7 );