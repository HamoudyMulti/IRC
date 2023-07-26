select * from (Select ID,
OTDBOwner.ValStr(ID,max(VerNum),1126878,49)as 'Reference_Number',
OTDBOwner.ValStr(ID,max(VerNum),1126878,29)as 'Card_Number',
OTDBOwner.ValStr(ID,max(VerNum),1126878,9)as 'Cardholder_Name',
OTDBOwner.ValStr(ID,max(VerNum),1126878,24)as 'Type',
OTDBOwner.ValStr(ID,max(VerNum),1126878,30)as 'Account_Number',
OTDBOwner.ValStr(ID,max(VerNum),1126878,26)as 'Delivery_Status',
OTDBOwner.ValStr(ID,max(VerNum),1126878,59)as 'Requesting_Branch'
from OTDBOwner.LLAttrData WITH (NOLOCK),OTDBOwner.DTree WITH (NOLOCK) WHERE DefID in (1126878)
and DTree.DataID=LLAttrData.ID
and DTree.SubType=848
group by ID
) as L
where L.ID=%1