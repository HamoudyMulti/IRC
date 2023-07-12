SELECT ValStr as Party,'Defensive' as CType
FROM OTCS.otcs.LLAttrData AS A WITH (NOLOCK)
JOIN OTCS.otcs.DTree AS D WITH (NOLOCK) ON D.DataID = A.ID
WHERE A.DefID = 302721
  AND D.SubType = 848
  AND A.AttrID = 4
  AND D.Name NOT LIKE '%Defensive Case%'
  AND A.AttrType IN (-1, 10, 11481, 10013, 11, 14)
and %1
  AND A.VerNum = (
    SELECT MAX(B.VerNum)
    FROM OTCS.otcs.LLAttrData AS B WITH (NOLOCK)
    JOIN OTCS.otcs.DTree AS C WITH (NOLOCK) ON C.DataID = B.ID
    WHERE B.DefID = 302721
      AND C.SubType = 848
      AND B.AttrID = 4
      AND C.Name NOT LIKE '%Defensive Case%'
      AND B.AttrType IN (-1, 10, 11481, 10013, 11, 14)
  )

UNION ALL

SELECT ValStr as Party,'Allegation' as CType
FROM OTCS.otcs.LLAttrData AS A WITH (NOLOCK)
JOIN OTCS.otcs.DTree AS D WITH (NOLOCK) ON D.DataID = A.ID
WHERE A.DefID = 302722
  AND D.SubType = 848
  AND A.AttrID = 3
  AND D.Name NOT LIKE '%Allegation Case%'
  AND A.AttrType IN (-1, 10, 11481, 10013, 11, 14)
and %1
  AND A.VerNum = (
    SELECT MAX(B.VerNum)
    FROM OTCS.otcs.LLAttrData AS B WITH (NOLOCK)
    JOIN OTCS.otcs.DTree AS C WITH (NOLOCK) ON C.DataID = B.ID
    WHERE B.DefID = 302722
      AND C.SubType = 848
      AND B.AttrID = 3
      AND C.Name NOT LIKE '%Allegation Case%'
      AND B.AttrType IN (-1, 10, 11481, 10013, 11, 14)
  );
