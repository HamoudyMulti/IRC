select distinct d.DataID,d.Name from otcs.Dtree d,otcs.LLAttrData a where d.subtype=144 
and a.valdate<%2 and a.valdate>%1
and a.DefID=44889 and (d.name not like N'محضر.pdf') and (d.name not like N'ملفات.pdf')
and d.DataID=a.id
order by d.name asc