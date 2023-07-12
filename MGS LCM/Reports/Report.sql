Select 
N'دفاعية' as CaseType,
OTCS.OTCS.ValDate(ID,max(VerNum),302721,8) as CaseDate,
OTCS.OTCS.ValStr(ID,max(VerNum),302721,13) as CaseStatus,
OTCS.OTCS.ValStr(ID,max(VerNum),302721,14) as CaseJudgment


from OTCS.OTCS.LLAttrData WITH (NOLOCK),OTCS.OTCS.DTree WITH (NOLOCK) 
WHERE DefID= 302721
AND   DTree.DataID=LLAttrData.ID
and DTree.SubType=848 and Name NOT LIKE '%Defensive Case%' AND %1
group by ID


UNION ALL


Select 
N'ادعاء' as CaseType,
OTCS.OTCS.ValDate(ID,max(VerNum),302722,8) as CaseDate,
OTCS.OTCS.ValStr(ID,max(VerNum),302722,11) as CaseStatus,
OTCS.OTCS.ValStr(ID,max(VerNum),302722,12) as CaseJudgment


from OTCS.OTCS.LLAttrData WITH (NOLOCK),OTCS.OTCS.DTree WITH (NOLOCK) 
WHERE DefID= 302722
AND   DTree.DataID=LLAttrData.ID
and DTree.SubType=848 and Name NOT LIKE '%Allegation Case%' AND %1
group by ID


UNION ALL


Select 
N'استئناف' as CaseType,
MAX(Dtree.CreateDate) as CaseDate,
OTCS.OTCS.ValStr(ID,max(VerNum),302723,8) as CaseStatus,
OTCS.OTCS.ValStr(ID,max(VerNum),302723,9) as CaseJudgment


from OTCS.OTCS.LLAttrData WITH (NOLOCK),OTCS.OTCS.DTree WITH (NOLOCK) 
WHERE DefID= 302723
AND   DTree.DataID=LLAttrData.ID
and DTree.SubType=848 and Name NOT LIKE '%Allegation Case%' AND %1
group by ID