SELECT (CASE WHEN AttrID = 13 THEN ValStr END) AS CStatus,
    (CASE WHEN AttrID = 4 AND ValStr = N'البنك المركزي السعودي' THEN ValStr END) AS CParty,
    N'مدعى عليه' as CType
FROM OTCS.otcs.LLAttrData AS A WITH (NOLOCK)
JOIN OTCS.otcs.DTree AS D WITH (NOLOCK) ON D.DataID = A.ID
WHERE A.DefID = 302721
  AND D.SubType = 848
  AND A.AttrID IN (4,13)
  AND D.Name NOT LIKE '%Defensive Case%'
  
  


UNION ALL

SELECT(CASE WHEN AttrID = 11 THEN ValStr END) AS CStatus,
    (CASE WHEN AttrID = 3 THEN ValStr END) AS CParty,
    N'مدعي' as CType
FROM OTCS.otcs.LLAttrData AS A WITH (NOLOCK)
JOIN OTCS.otcs.DTree AS D WITH (NOLOCK) ON D.DataID = A.ID
WHERE A.DefID = 302722
  AND D.SubType = 848
  AND A.AttrID IN (3,11)
  AND D.Name NOT LIKE '%Allegation Case%'
  and ValStr = N'البنك المركزي السعودي'


 UNION ALL

SELECT (CASE WHEN AttrID = 8 THEN ValStr END) AS CStatus,
    (CASE WHEN AttrID = 2 THEN ValStr END) AS CParty,
    N'مدعي' as CType
FROM OTCS.otcs.LLAttrData AS A WITH (NOLOCK)
JOIN OTCS.otcs.DTree AS D WITH (NOLOCK) ON D.DataID = A.ID
WHERE A.DefID = 302723
  AND D.SubType = 848
  AND A.AttrID IN (8,2)
  AND D.Name NOT LIKE '%Appeal Case%'
  and ValStr = N'البنك المركزي السعودي'

UNION ALL

SELECT (CASE WHEN AttrID = 8 THEN ValStr END) AS CStatus,
    (CASE WHEN AttrID = 3 THEN ValStr END) AS CParty,
    N'مدعى عليه' as CType
FROM OTCS.otcs.LLAttrData AS A WITH (NOLOCK)
JOIN OTCS.otcs.DTree AS D WITH (NOLOCK) ON D.DataID = A.ID
WHERE A.DefID = 302723
  AND D.SubType = 848
  AND A.AttrID IN (8,3)
  AND D.Name NOT LIKE '%Appeal Case%'
  and ValStr = N'البنك المركزي السعودي'