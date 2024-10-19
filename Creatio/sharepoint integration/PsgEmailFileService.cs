 
namespace PsiogSharePointConnector.Files.cs.SPWebServices
{
 
	using SPCoreServicesNamespace.API;
	using System;
	using System.Collections.Generic;
	using Terrasoft.Core.Factories;
	using Terrasoft.Web.Common;

	#region Class: PsgEmailFileService

	public class PsgEmailFileService : BaseService
	{
		#region Constructors: Public

		public PsgEmailFileService() : base()
		{

		}
		#endregion

		#region Properties: Private
		private SPCoreServices _psgSPSCore;

		private SPCoreServices PsgSPSCore
		{
			get
			{
				_psgSPSCore = ClassFactory.Get<SPCoreServices>(new ConstructorArgument("userConnection", UserConnection));
				return _psgSPSCore;
			}
		}

		#endregion

		#region Methods: Public

		public void DownloadFileForEmail(List<Guid> FileIds, string SchemaName, Guid ActivityId)
		{
			PsgSPSCore.DownloadFileForEmail(FileIds, SchemaName, ActivityId);
		}

		#endregion
	}

	#endregion
}

