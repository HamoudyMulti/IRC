SELECT * FROM cards_tracking
WHERE 
performer LIKE '%'+N%1+'%'
and reference_number LIKE '%'+N%2+'%'
and from_status LIKE '%'+N%3+'%'
and to_status LIKE '%'+N%4+'%'
and created_at between %5 and %6+1