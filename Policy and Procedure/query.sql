SELECT distinct(D.DataID), k.ID, kc.ChildID,

CASE
        WHEN kuaf.Type = 1 THEN kuaf.Name
        ELSE kuaf.FirstName + ' ' + kuaf.LastName
    END AS Department
FROM OTDBOwner.LLAttrData AS A WITH (NOLOCK)
JOIN OTDBOwner.DTree AS D WITH (NOLOCK) ON D.DataID = A.ID
JOIN [OTDBOwner].[KUAF] as k WITH (NOLOCK) ON D.DataID = k.Type and k.name = 'Departments'
JOIN [OTDBOwner].[KUAFChildren] as kc WITH (NOLOCK) ON k.ID= kc.ID
JOIN [OTDBOwner].[KUAF] as kuaf WITH (NOLOCK) ON kc.ChildID= kuaf.ID
WHERE A.DefID = 1710146 AND D.SubType = 848 and D.Name != 'Regulation'
