 namespace PsiogSharePointConnector.Files.cs.SPWebServices
{
    using Common.Logging;
    using System;
    using System.Text.RegularExpressions;
    using Terrasoft.Core;
    using Terrasoft.Core.Entities;
    using Terrasoft.Core.Entities.Events;


    [EntityEventListener(SchemaName = "PsgSPScaffoldingStructure")]
    public class LookupEntityEventListener : BaseEntityEventListener
    {
        // Overriding the event handler of entity saving event.
        public override void OnInserting(object sender, EntityBeforeEventArgs e)
        {
            base.OnInserting(sender, e);
            var entity = (Entity)sender;
            string[] dirCols = new string[3];
            Guid sectionId = entity.GetTypedColumnValue<Guid>("PsgSectionId");
            string uniqueCol = entity.GetTypedColumnValue<string>("PsgUniqueName");
            dirCols[0] = entity.GetTypedColumnValue<string>("PsgSubDir1");
            dirCols[1] = entity.GetTypedColumnValue<string>("PsgSubDir2");
            dirCols[2] = entity.GetTypedColumnValue<string>("PsgSubDir3");

            if (sectionId != Guid.Empty)
            {
                bool isDuplicate = IsDuplicateSectionConfigured(sectionId, entity.UserConnection);
                if (isDuplicate)
                {
                    e.IsCanceled = true;
                    throw new Exception("This section has already been configured.Please add new section or update existing record");

                }

                string isColValid = CheckUniqueColumn(uniqueCol, sectionId, entity.UserConnection);
                if (isColValid != "Ok")
                {
                    e.IsCanceled = true;
                    if (isColValid == "403")
                    {
                        throw new Exception("Activity section cannot be configured for Sharepoint integration");
                    }
                    else
                    {
                        throw new Exception(isColValid + "Please check the record added");
                    }
                }

                if(ContainsSpecialCharacters(dirCols))
                {
                    throw new Exception("Subdirectories cannot contain special characters. It is recommended to use \"_\" instead");
                }
				if(ContainsTrailingSpace(dirCols))
				{
				 throw new Exception("Subdirectories cannot contain trailing whitespaces.");
				}
				
				string sectionCode = "";
				var getParent = new EntitySchemaQuery(entity.UserConnection.EntitySchemaManager, "SysModule");

				var configCol = getParent.AddColumn("Code").Name;
				var recordFilter = getParent.CreateFilterWithParameters(FilterComparisonType.Equal,
					   "Id", sectionId);
				getParent.Filters.Add(recordFilter);

				var esqResult = getParent.GetEntityCollection(entity.UserConnection);
				foreach (var rec in esqResult)
				{
					sectionCode = rec.GetTypedColumnValue<string>(configCol);

				}
				
				entity.SetColumnValue("PsgSectionCode", sectionCode);

            }

        }

        private string CheckUniqueColumn(string uniqueCol, Guid SectionId, UserConnection UserConnection)
        {
            if (uniqueCol.StartsWith("/") || uniqueCol.EndsWith("/"))
                throw new Exception("Unique Name values cannot StartsWith or EndsWith \"/\"");

            string sectionName = "";
            var getParent = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "SysModule");

            var configCol = getParent.AddColumn("Code").Name;
            var recordFilter = getParent.CreateFilterWithParameters(FilterComparisonType.Equal,
                   "Id", SectionId);
            getParent.Filters.Add(recordFilter);

            var esqResult = getParent.GetEntityCollection(UserConnection);
            foreach (var rec in esqResult)
            {
                sectionName = rec.GetTypedColumnValue<string>(configCol);

            }

            if (sectionName == "Activity")
            {
                return "403";
            }

            var uniqueColList = uniqueCol.Split('/');
            var getUniqueNameEsq = new EntitySchemaQuery(UserConnection.EntitySchemaManager, sectionName);


            foreach (var uniqueColValue in uniqueColList)
            {
                _ = getUniqueNameEsq.AddColumn(uniqueColValue).Name;
            }
            try
            {
                var colCheckResult = getUniqueNameEsq.GetEntityCollection(UserConnection);
                if (colCheckResult.Count > 0)
                {
                    return "Ok";
                }
            }
            catch (Exception e)
            {
               return e.Message;

            }
            return "";
        }

        private bool IsDuplicateSectionConfigured(Guid SectionId, UserConnection UserConnection)
        {

            try
            {

                var PsgCheckEsq = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "PsgSPScaffoldingStructure");
                var idColumn = PsgCheckEsq.AddColumn("Id").Name;

                var sectionFilter = PsgCheckEsq.CreateFilterWithParameters(FilterComparisonType.Equal,
                    "PsgSection", SectionId);
                PsgCheckEsq.Filters.Add(sectionFilter);

                var esqResult = PsgCheckEsq.GetEntityCollection(UserConnection);
                if (esqResult.Count > 0)
                {
                    return true;
                }
            }
            catch (Exception e)
            {
                return true;
            }

            return false;
        }

        public override void OnUpdating(object sender, EntityBeforeEventArgs e)
        {
            base.OnUpdating(sender, e);
            var entity = (Entity)sender;
            Guid sectionId = entity.GetTypedColumnValue<Guid>("PsgSectionId");
            string[] dirCols = new string[3];
            dirCols[0] = entity.GetTypedColumnValue<string>("PsgSubDir1");
            dirCols[1] = entity.GetTypedColumnValue<string>("PsgSubDir2");
            dirCols[2] = entity.GetTypedColumnValue<string>("PsgSubDir3");
            if (sectionId != Guid.Empty)
            {

                string uniqueCol = entity.GetTypedColumnValue<string>("PsgUniqueName");
                string isColValid = CheckUniqueColumn(uniqueCol, sectionId, entity.UserConnection);
                if (isColValid != "Ok")
                {
                    if (isColValid == "403")
                    {
                        throw new Exception("Activity section cannot be configured for Sharepoint integration");
                    }
                    else
                    {
                        throw new Exception(isColValid + "Please check the record added");
                    }
                }
                if (ContainsSpecialCharacters(dirCols))
                {
                    throw new Exception("Subdirectories cannot contain special characters. It is recommended to use \"_\" instead");
                }
				
				if(ContainsTrailingSpace(dirCols))
				{
				 throw new Exception("Subdirectories cannot contain trailing whitespaces.");
				}
				
				string sectionCode = "";
				var getParent = new EntitySchemaQuery(entity.UserConnection.EntitySchemaManager, "SysModule");

				var configCol = getParent.AddColumn("Code").Name;
				var recordFilter = getParent.CreateFilterWithParameters(FilterComparisonType.Equal,
					   "Id", sectionId);
				getParent.Filters.Add(recordFilter);

				var esqResult = getParent.GetEntityCollection(entity.UserConnection);
				foreach (var rec in esqResult)
				{
					sectionCode = rec.GetTypedColumnValue<string>(configCol);

				}
				
				entity.SetColumnValue("PsgSectionCode", sectionCode);

            }
        }
        public bool ContainsSpecialCharacters(string[] DirectoryNames)
        {
            Regex Rgx = new Regex("^[a-zA-Z0-9_() -]*$");
            bool ContainsInv = false;
            foreach (string name in DirectoryNames)
            {
				if(!string.IsNullOrEmpty(name))
				{ 
					ContainsInv =!(Rgx.IsMatch(name));
					if (ContainsInv)
					{
						return true;
					}
				}
            }

            return false;
        }
		
		public bool ContainsTrailingSpace(string[] DirectoryNames)
		{
			bool hasTSpace = false;
            foreach (string name in DirectoryNames)
            {
				if(!string.IsNullOrEmpty(name))
				{ 
					if(name.Trim()!= name)
					{
						return true;
					}
				}
            }

            return false;
		}

    }
}




