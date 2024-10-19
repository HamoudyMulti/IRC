define("PageWithTabsFreedomTemplate", /**SCHEMA_DEPS*/["@creatio-devkit/common", "ServiceHelper", "css!PsgSPAttachmentGalleryVisibilityCSS"]/**SCHEMA_DEPS*/, function/**SCHEMA_ARGS*/(sdk, ServiceHelper)/**SCHEMA_ARGS*/ {
	return {
		viewConfigDiff: /**SCHEMA_VIEW_CONFIG_DIFF*/[
			{
				"operation": "merge",
				"name": "AttachmentList",
				"values": {
					"visible": false
				}
			},
			{
				"operation": "merge",
				"name": "AttachmentAddButton",
				"values": {
					"visible": true
				}
			},
			{
				"operation": "insert",
				"name": "AttachmentList2",
				"values": {
					"type": "crt.DataGrid",
					"items": "$AttachmentList",
					"primaryColumnName": "AttachmentListDS_Id",
					"columns": [
						{
							"code": "AttachmentListDS_Name",
							"caption": "#ResourceString(AttachmentListDS_Name)#",
							"dataValueType": 28,
							"width": 200
						}
					],
					"features": {
						"editable": {
							"enable": false,
							"itemsCreation": false
						}
					},
					"rowToolbarItems": [
						{
							"type": "crt.MenuItem",
							"caption": "#ResourceString(SPView)#",
							"icon": "open-button-icon",
							"clicked": {
								"request": "psg.ViewFileOnSharePoint",
								"params": {
									"Id": "$AttachmentList.AttachmentListDS_Id",
									"NotInSPMsg": "#ResourceString(CannotViewInSPMsg)#"
								}
							}
						},
						{
							"type": "crt.MenuItem",
							"caption": "#ResourceString(SPCopyLink)#",
							"icon": "document-new-button-icon",
							"clicked": {
								"request": "psg.CopyLink",
								"params": {
									"Id": "$AttachmentList.AttachmentListDS_Id",
									"CopySuccessful": "#ResourceString(CopySuccessfulMsg)#",
									"CopyUnsuccessful": "#ResourceString(CopyUnsuccessfulMsg)#"
								}
							}
						},
						{
							"type": "crt.MenuItem",
							"caption": "#ResourceString(SPRetry)#",
							"icon": "reload-button-icon",
							"clicked": {
								"request": "psg.RetryUpload",
								"params": {
									"Id": "$AttachmentList.AttachmentListDS_Id",
									"Name": "$AttachmentList.AttachmentListDS_Name",
									"InSPMsg": "#ResourceString(AlreadyInSharePoint)#",
									"UploadSuccessMsg": "#ResourceString(UploadSuccessMsg)#",
									"SPNotConfiguredMsg": "#ResourceString(NotConfiguredSP)#",
									"FileNameTooLongMsg": "#ResourceString(FileNameTooLong)#"
								}
							},
							"visible": "$IsSPConfigured"
						},
						{
							"type": "crt.MenuItem",
							"caption": "#ResourceString(SPDownload)#",
							"icon": "download-button-icon",
							"clicked": {
								"request": "psg.DownloadFile",
								"params": {
									"Id": "$AttachmentList.AttachmentListDS_Id",
									"Name": "$AttachmentList.AttachmentListDS_Name"
								}
							}
						},
						{
							"type": "crt.MenuItem",
							"caption": "#ResourceString(SPDelete)#",
							"icon": "delete-button-icon",
							"clicked": {
								"request": "psg.DeleteFile",
								"params": {
									"Id": "$AttachmentList.AttachmentListDS_Id",
									"DeleteMsg": "#ResourceString(DeleteConfirmationMessage)#",
									"DeleteSPMsg": "#ResourceString(DeleteSPConfirmationMessage)#"
								}
							}
						}
					]
				},
				"parentName": "AttachmentsTabContainer",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "AttachmentAddToSPButton",
				"values": {
					"type": "crt.Button",
					"caption": "#ResourceString(AttachmentAddToSPButton_caption)#",
					"icon": "clip-button-icon",
					"iconPosition": "only-icon",
					"color": "primary",
					"size": "medium",
					"clicked": {
						"request": "psg.UploadToSPRequest",
						"params": {
							"viewElementName": "AttachmentList",
							"UploadSuccessMsg": "#ResourceString(UploadSuccessMsg)#",
							"SizeExceededMsg": "#ResourceString(SizeExceededMsg)#",
							"UnsupportedFileTypeMsg": "#ResourceString(UnsupportedFileTypeMsg)#",
							"SPNotConfiguredMsg": "#ResourceString(NotConfiguredSP)#",
							"FileNameTooLongMsg": "#ResourceString(FileNameTooLong)#"
						}
					},
					"visible": "$IsSPConfigured",
					"clickMode": "default"
				},
				"parentName": "AttachmentsTabContainerHeaderContainer",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "merge",
				"name": "AttachmentAddButton",
				"values": {
					"visible": "$UploadToCreatioDB"
				}
			}
		]/**SCHEMA_VIEW_CONFIG_DIFF*/,
		viewModelConfigDiff: /**SCHEMA_VIEW_MODEL_CONFIG_DIFF*/{
			"attributes": {
        		"IsSPConfigured": {
					"value": false
				},
				"UploadToCreatioDB": {
					"value": true
				}
    		}
		}/**SCHEMA_VIEW_MODEL_CONFIG_DIFF*/,
		modelConfigDiff: /**SCHEMA_MODEL_CONFIG_DIFF*/[]/**SCHEMA_MODEL_CONFIG_DIFF*/,
		handlers: /**SCHEMA_HANDLERS*/[
			//ViewOnSharePoint
			{
				request: "psg.ViewFileOnSharePoint",
				handler: async (request, next) => {
					const FileLinksModel  = await sdk.Model.create("PsgFileLink");
					let filterFileLink = new sdk.FilterGroup();
					await filterFileLink.addSchemaColumnFilterWithParameter(sdk.ComparisonType.Equal,"PsgFileId",request.Id);
					var newfilterFileLink = Object.assign({}, filterFileLink);
					newfilterFileLink.items = filterFileLink.items;
					const FileLinkDetails = await FileLinksModel.load({
						attributes:["Id","PsgShareableLink"],
						parameters:[{
							type:sdk.ModelParameterType.Filter,
							value:newfilterFileLink
						}]
					});
					if(FileLinkDetails.length>0 && FileLinkDetails[0].PsgShareableLink){
						var sharelink = FileLinkDetails[0].PsgShareableLink;
						var a = document.createElement("a");
						a.href = sharelink;
						a.target = "_blank";
						document.body.appendChild(a);
						a.click();
						document.body.removeChild(a); 
					}
					else
						Terrasoft.showInformation(request.NotInSPMsg);
					return next?.handle(request);
				}
			},
			//Download
			{
				request: "psg.DownloadFile",
				handler: async (request, next) => {
					var entitySchemaName = request.$context.dataSchemas.AttachmentListDS.name;
					const FileLinksModel  = await sdk.Model.create("PsgFileLink");
					let filterFileLink = new sdk.FilterGroup();
					await filterFileLink.addSchemaColumnFilterWithParameter(sdk.ComparisonType.Equal,"PsgFileId",request.Id);
					var newfilterFileLink = Object.assign({}, filterFileLink);
					newfilterFileLink.items = filterFileLink.items;
					const FileLinkDetails = await FileLinksModel.load({
						attributes:["Id","PsgShareableLink", "PsgCurrentStorage"],
						parameters:[{
							type:sdk.ModelParameterType.Filter,
							value:newfilterFileLink
						}]
					});
					if(FileLinkDetails.length>0 && FileLinkDetails[0].PsgCurrentStorage.value=="035a52bd-afaa-4f99-898f-ab51f694c1e5"){
						var a = window.document.createElement("a");						
						a.href = "/0/rest/PsgSPFileDownloadService/DownloadFile?fileId=" 
							+ request.Id + "&fileName=" + request.Name;
						document.body.appendChild(a);
						a.click();
						document.body.removeChild(a);
					}
					else{
						var a = window.document.createElement("a");						
						a.href = "/0/rest/FileService/Download/" 
							+ entitySchemaName + "/" + request.Id;
						document.body.appendChild(a);
						a.click();
						document.body.removeChild(a);
					}
					return next?.handle(request);
				}
			},
			//Copy Link
			{
				request: "psg.CopyLink",
				handler: async (request, next) => {
					const FileLinksModel  = await sdk.Model.create("PsgFileLink");
					let filterFileLink = new sdk.FilterGroup();
					await filterFileLink.addSchemaColumnFilterWithParameter(sdk.ComparisonType.Equal,"PsgFileId",request.Id);
					var newfilterFileLink = Object.assign({}, filterFileLink);
					newfilterFileLink.items = filterFileLink.items;
					const FileLinkDetails = await FileLinksModel.load({
						attributes:["Id","PsgShareableLink"],
						parameters:[{
							type:sdk.ModelParameterType.Filter,
							value:newfilterFileLink
						}]
					});
					if(FileLinkDetails.length>0 && FileLinkDetails[0].PsgShareableLink){
						var sharelink = FileLinkDetails[0].PsgShareableLink;
						var tmp = document.createElement("INPUT");
						focus = document.activeElement;
						tmp.value = sharelink;
						document.body.appendChild(tmp);
						tmp.select();
						document.execCommand('copy');
						Terrasoft.showInformation(request.CopySuccessful);
						document.body.removeChild(tmp);
						focus.focus();
					}
					else
						Terrasoft.showInformation(request.CopyUnsuccessful);
					return next?.handle(request);
				}
			},
			//Delete
			{
				request: "psg.DeleteFile",
				handler: async (request, next) => {
										
					var entitySchemaName = request.$context.dataSchemas.AttachmentListDS.name;
					var fileArr=[request.Id];
					const FileLinksModel  = await sdk.Model.create("PsgFileLink");
					let filterFileLink = new sdk.FilterGroup();
					await filterFileLink.addSchemaColumnFilterWithParameter(sdk.ComparisonType.Equal,"PsgFileId",request.Id);
					var newfilterFileLink = Object.assign({}, filterFileLink);
					newfilterFileLink.items = filterFileLink.items;
					const FileLinkDetails = await FileLinksModel.load({
						attributes:["Id","PsgCurrentStorage"],
						parameters:[{
							type:sdk.ModelParameterType.Filter,
							value:newfilterFileLink
						}]
					});
					if(FileLinkDetails.length>0){
						var deleteMsg = request.DeleteMsg;
						//SharePoint Storage
						if(FileLinkDetails[0].PsgCurrentStorage.value=="035a52bd-afaa-4f99-898f-ab51f694c1e5")
							deleteMsg = request.DeleteSPMsg;
						Terrasoft.showConfirmation(deleteMsg, function(result) {
							const maskService = new sdk.MaskService();
							const taskName = 'DELETE_SP';
							if (result === Terrasoft.MessageBoxButtons.YES.returnCode){
								maskService.showBodyMask(taskName, request.$context);
								var fileData = {
									DetailName: entitySchemaName,
									FileIds : fileArr
								};
								ServiceHelper.callService("PsgSharePointFileApiService", "DeleteFileFromSharePoint", async function(response) {
									maskService.hideBodyMask(taskName, request.$context);
									const handlerChain = sdk.HandlerChainService.instance;
									await handlerChain.process({
										type: "crt.LoadDataRequest",
										$context: request.$context,
										config: {
											loadType: "reload",
										},
										dataSourceName: "AttachmentListDS"
									});
								}, fileData, this);
							}
						}, ["yes", "no"], this);					
					}
					else{
						Terrasoft.showConfirmation(request.DeleteMsg, function(result) {
							const maskService = new sdk.MaskService();
							const taskName = 'DELETE_DB';
							if (result === Terrasoft.MessageBoxButtons.YES.returnCode){
								maskService.showBodyMask(taskName, request.$context);
								var dbFileData = {
									rootSchema: entitySchemaName,
									primaryColumnValues : fileArr,
									parameters: "{'operationKey':'120c2c54-b918-84c6-c986-116c10429e3b'}"
								};
								ServiceHelper.callService("GridUtilitiesService", "DeleteRecordsAsync", async function(response) 								{
									maskService.hideBodyMask(taskName, request.$context);
									const handlerChain = sdk.HandlerChainService.instance;
									await handlerChain.process({
										type: "crt.LoadDataRequest",
										$context: request.$context,
										config: {
											loadType: "reload",
										},
										dataSourceName: "AttachmentListDS"
									});
								}, dbFileData, this);
							}
						}, ["yes", "no"], this);
					}
					return next?.handle(request);
				}
			},
			//Retry Upload
			{
				request: "psg.RetryUpload",
				handler: async (request, next) => {
					
					const maskService = new sdk.MaskService();
					const taskName = 'RETRY_UPLOAD';
					maskService.showBodyMask(taskName, request.$context);
					
					var entitySchemaName = request.$context.dataSchemas.AttachmentListDS.name;
					var parentColumnValue = request.$context.attributes.Id;
					var parentColumnName = request.$context.dataSchemas.PDS.name;
					var customSection = false;
					
					// File name longer than 50 characters
					if(request.Name.length>50){
						maskService.hideBodyMask(taskName, request.$context);
						Terrasoft.showInformation(request.FileNameTooLongMsg);
						return;
					}
					
					if(entitySchemaName=="SysFile"){
						customSection = true;
						entitySchemaName = parentColumnName+"File";
						parentColumnName = "RecordId";
					}
					else
						parentColumnName+= "Id";
					
					const FileLinksModel  = await sdk.Model.create("PsgFileLink");
					let filterFileLink = new sdk.FilterGroup();
					await filterFileLink.addSchemaColumnFilterWithParameter(sdk.ComparisonType.Equal,"PsgFileId",request.Id);
					var newfilterFileLink = Object.assign({}, filterFileLink);
					newfilterFileLink.items = filterFileLink.items;
					const FileLinkDetails = await FileLinksModel.load({
						attributes:["Id","PsgCurrentStorage"],
						parameters:[{
							type:sdk.ModelParameterType.Filter,
							value:newfilterFileLink
						}]
					});
					
					if(FileLinkDetails.length>0){
						//Already in SharePoint Storage
						if(FileLinkDetails[0].PsgCurrentStorage.value=="035a52bd-afaa-4f99-898f-ab51f694c1e5"){
							maskService.hideBodyMask(taskName, request.$context);
							Terrasoft.showInformation(request.InSPMsg);
							return;
						}
					}
					
					//Not in SharePoint 
						var fileData = {
							FileId: request.Id,
							EntitySchemaName: entitySchemaName,
							ParentColumnName: parentColumnName,
							ParentColumnValue : parentColumnValue
						};	
					
					try{
						var esCode = await request.$context.dataSchemas.PDS.dataSourceConfig.config.entitySchemaName;

						const SPScaffoldingStructure  = await sdk.Model.create("PsgSPScaffoldingStructure");
						let FilterBySection = new sdk.FilterGroup();
						FilterBySection.addSchemaColumnFilterWithParameter(sdk.ComparisonType.Equal,"PsgSectionCode", esCode);
						const NewFilters = Object.assign({}, FilterBySection);
						NewFilters.items = FilterBySection.items;
						const SPConfig = await SPScaffoldingStructure.load({
							attributes:["Id","PsgSectionCode"],

							parameters:[{
								type:sdk.ModelParameterType.Filter,
								value:NewFilters
							}]	

						});
						if (SPConfig.length > 0) {
							var uploadMethod = "RetryUploadToSharePoint";
							if(customSection)
								uploadMethod+= "Custom";

							ServiceHelper.callService("PsgSharePointFileApiService", uploadMethod, async function(response) {
								maskService.hideBodyMask(taskName, request.$context);
								if(response=="Ok")
									Terrasoft.showInformation(request.UploadSuccessMsg);
								else
									Terrasoft.showInformation(response);
								const handlerChain = sdk.HandlerChainService.instance;
								await handlerChain.process({
									type: "crt.LoadDataRequest",
									$context: request.$context,
									config: {
										loadType: "reload",
									},
									dataSourceName: "AttachmentListDS"
								});
							}, fileData, this);	
						}
						else {
							maskService.hideBodyMask(taskName, request.$context);
							Terrasoft.showInformation(request.SPNotConfiguredMsg);
						}
						return next?.handle(request);
					}
					catch(error){
						return next?.handle(request);
					}
				}
			},
			//Upload to SharePoint
			{
				request: "psg.UploadToSPRequest",
				/* The custom implementation of the system query handler. */
				handler: async (request, next) => {
					
					try{
					
						var esCode = await request.$context.dataSchemas.PDS.dataSourceConfig.config.entitySchemaName;

						const SPScaffoldingStructure  = await sdk.Model.create("PsgSPScaffoldingStructure");
						let FilterBySection = new sdk.FilterGroup();
						FilterBySection.addSchemaColumnFilterWithParameter(sdk.ComparisonType.Equal,"PsgSectionCode", esCode);
						const NewFilters = Object.assign({}, FilterBySection);
						NewFilters.items = FilterBySection.items;
						const SPConfig = await SPScaffoldingStructure.load({
							attributes:["Id","PsgSectionCode"],

							parameters:[{
								type:sdk.ModelParameterType.Filter,
								value:NewFilters
							}]	

						});
						if (SPConfig.length > 0) {
							const sysSettingsService = new sdk.SysSettingsService();
							var maxSize = await sysSettingsService.getByCode('MaxFileSize');
							var allowedSize = (maxSize.value) * 1000000;
							var allowList = await sysSettingsService.getByCode('FileExtensionsAllowList');
							var allowListValue = allowList.value;
							const allowedExtensions = allowListValue.split(",");
							var entitySchemaName = request.$context.dataSchemas.AttachmentListDS.name;
							var parentColumnValue = request.$context.attributes.Id;
							var parentColumnName = request.$context.dataSchemas.PDS.name;
							var customSection = false;
							if(entitySchemaName=="SysFile"){
								customSection = true;
								entitySchemaName = parentColumnName+"File";
								parentColumnName = "Record";
							}					
							let input = document.createElement('input');
							input.type = 'file';
							input.addEventListener('change', (e) => {
								const maskService = new sdk.MaskService();
								const taskName = 'UPLOAD';
								maskService.showBodyMask(taskName, request.$context);
								// Get a reference to the file
								const file = e.target.files[0];
								var fileExt = file.name.split('.').pop();
								if (file.size>allowedSize){
									maskService.hideBodyMask(taskName, request.$context);
									Terrasoft.showInformation(maxSize.value + request.SizeExceededMsg);
									return;
								}
								if(!(allowedExtensions.includes(fileExt))){
									maskService.hideBodyMask(taskName, request.$context);
									Terrasoft.showInformation(request.UnsupportedFileTypeMsg + fileExt);
									return;
								}
								if(file.name.length>50){
									maskService.hideBodyMask(taskName, request.$context);
									Terrasoft.showInformation(request.FileNameTooLongMsg);
									return;
								}
								const blobToBase64 = blob => new Promise((resolve, reject) => {
									const reader = new FileReader();
									reader.readAsDataURL(blob);
									reader.onload = () => resolve(reader.result);
									reader.onerror = error => reject(error);
								});
								const convertBlobToBase64 = async (blob) => {
								  return await blobToBase64(blob);
								}

								var fileBase64Promise = convertBlobToBase64(file);
								fileBase64Promise.then(fileBase64 => {
									var base64String = fileBase64.replace('data:', '').replace(/^.+,/, '');

									var fileData = {
										File: base64String,
										FileName: file.name,
										TotalFileLength: file.size,
										EntitySchemaName: entitySchemaName,
										ParentColumnName: parentColumnName,
										ParentColumnValue : parentColumnValue
									};
									var uploadMethod = "UploadFileToSharePointFreedom";
									if(customSection)
										uploadMethod+= "Custom"
									ServiceHelper.callService("PsgSharePointFileApiService", uploadMethod, async function(response) {
										maskService.hideBodyMask(taskName, request.$context);
										if(response=="Ok")
											Terrasoft.showInformation(request.UploadSuccessMsg);
										else
											Terrasoft.showInformation(response);
										const handlerChain = sdk.HandlerChainService.instance;
										await handlerChain.process({
											type: "crt.LoadDataRequest",
											$context: request.$context,
											config: {
												loadType: "reload",
											},
											dataSourceName: "AttachmentListDS"
										});
									}, fileData, this);


								}).catch(err => {
									maskService.hideBodyMask(taskName, request.$context);
								});


							});
							input.click();
							return next?.handle(request);
						}
						else{
							Terrasoft.showInformation(request.SPNotConfiguredMsg);
						}
					}catch(error){
						
					}
				}
			},
			//Check if SP is configured
			{
				request: "crt.HandleViewModelInitRequest",
				/* The custom implementation of the system query handler. */
				handler: async (request, next) => {
					try{
						var esCode = await request.$context.dataSchemas.PDS.dataSourceConfig.config.entitySchemaName;		
						const SPScaffoldingStructure  = await sdk.Model.create("PsgSPScaffoldingStructure");
						let FilterBySection = new sdk.FilterGroup();
						FilterBySection.addSchemaColumnFilterWithParameter(sdk.ComparisonType.Equal,"PsgSectionCode", esCode);
						const NewFilters = Object.assign({}, FilterBySection);
						NewFilters.items = FilterBySection.items;
						const SPConfig = await SPScaffoldingStructure.load({
							attributes:["Id","PsgSectionCode"],

							parameters:[{
								type:sdk.ModelParameterType.Filter,
								value:NewFilters
							}]	

						});
						if (SPConfig.length > 0) {
							request.$context.IsSPConfigured = true;
							request.$context.UploadToCreatioDB = false;
						}
						else {
							request.$context.IsSPConfigured = false;
							request.$context.UploadToCreatioDB = true;
						}
						return next?.handle(request);
					}
					catch(err){
						return next?.handle(request);
					}
				}
			}
		]/**SCHEMA_HANDLERS*/,
		converters: /**SCHEMA_CONVERTERS*/{}/**SCHEMA_CONVERTERS*/,
		validators: /**SCHEMA_VALIDATORS*/{}/**SCHEMA_VALIDATORS*/
	};
});