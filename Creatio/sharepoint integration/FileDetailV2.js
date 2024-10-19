define("FileDetailV2", ["FileDetailV2Resources", "PsgCurrentStorageImageConstants", "ViewUtilities", "ConfigurationConstants", "ConfigurationEnums", "ServiceHelper", "ProcessModuleUtilities","terrasoft", "BusinessRuleModule", "ImageListViewModel", "GridUtilitiesV2","ConfigurationGrid", "ConfigurationGridGenerator", "ConfigurationGridUtilities"],
    function(Resources,PsgCurrentStorageImageConstants, ViewUtilities, ConfigurationConstants, ConfigurationEnums, ServiceHelper, ProcessModuleUtilities,Terrasoft, BusinessRuleModule) 
            {
        return {
            rules: {
            },
            attributes: {   
                "ShareButtonMenuItems": {
                    dataValueType: Terrasoft.DataValueType.COLLECTION
                }
            },
    
            messages: {
            },
             mixins: {
             ConfigurationGridUtilites: "Terrasoft.ConfigurationGridUtilities"
            },
            methods: {
                
                    init: function() {
                            this.callParent(arguments);
                            this.loadSPConfiguration();
                        
                        },
                
                    loadSPConfiguration : function()
                    {
                    
                        var scope = this;
                        var requestData = {
                        sectionName: this.get("DetailColumnName")
                        };
                        var config = {
                            serviceName: "PsgSpService",
                            methodName: "IsSpConfiguredForSection",
                            callback: this.spConfigurationCallback,
                            data: requestData,
                            scope: scope,
                            timeout: 4 * 60 * 1000
                        };
                        ServiceHelper.callService(config);
                    },
    
                    spConfigurationCallback: function(response) {
                        if(response) {
                            this.set("isSPConfigured", response.IsSpConfiguredForSectionResult);
                        
                        }
                    },
                    getAddToCloudButtonVisible : function(){
                            return this.get("isSPConfigured");
                    },
                
                    getAddRecordButtonVisible :function(){
                        return !this.get("isSPConfigured");
                    },
                    
                    
                    getUploadConfig: function(files) {
                            return {
                                scope: this,
                                onUpload: this.onUpload,
                                onComplete: this.onComplete,
                                onFileComplete: this.onFileComplete,
                                entitySchemaName: this.entitySchema.name,
                                columnName: "Data",
                                parentColumnName: this.get("DetailColumnName"),
                                parentColumnValue: this.get("MasterRecordId"),
                                files: files,
                                isChunkedUpload: false,
                                oversizeErrorHandler: this.onFilesOversized,
                                additionalParams: {isSpConfigured :this.get("isSPConfigured")},
                                uploadWebServicePath: "PsgSharePointFileApiService/UploadFileToSharePoint"
                            };
                    },
                    onFileComplete: function(error, xhr, file, options) {
                        if (!error) {
                            var uploadResult = Terrasoft.decode(xhr.response);				
                            this.loadGridDataRecord(options.data.fileId);
                        }
                        else {
                            this.onFileCompleteError(error, file);
                            this.reloadGridData();
                        }
                },
                    linkClicked: function(recordId, columnName, href) {
                    
                    var fileName = this.getGridData().collection.map[recordId].values.Name;
                    var currentStorage = this.getGridData().collection.map[recordId].values.CurrentStorage;
                    var scope = this;
                        
                        if(currentStorage.value==="c169e258-4bd0-44f1-93b1-0a85e7a42354") //Creatio Database
                        { 
                            var oReq = new XMLHttpRequest();
                                    oReq.open("GET", href, true);
                                    oReq.responseType = "blob";
                                    oReq.send();
                                    scope.console.log(oReq);
                                    oReq.onload = function(oEvent) {
                                        switch (oReq.status) {
                                            case 200:
                                                var blob = oReq.response;
                                                var csvFile = document.createElement("a");
                                                csvFile.href = URL.createObjectURL(blob);
                                                csvFile.download = fileName;
                                                document.body.appendChild(csvFile);
                                                csvFile.click();
                                                break;
                                                case 404:
                                                scope.showConfirmationDialog(scope.get("Resources.Strings.FileNotFound"));
                                                break;
                                        }
                                    };
                                
                        }
                        else{						
                              Terrasoft.showConfirmation(this.get("Resources.Strings.ChooseAction"), function(result) { 
                                  if (result === "download") {
                                      // Download
                                      var a = window.document.createElement("a");						
                                      a.href = "/0/rest/PsgSPFileDownloadService/DownloadFile?fileId=" 
                                      + recordId + "&fileName=" + fileName;
                                      document.body.appendChild(a);
                                      a.click();
                                      document.body.removeChild(a); 
                                  } else if(result === "view") {
                                      // View
                                      var a = document.createElement("a");
                                      a.href = this.getGridData().collection.map[recordId].values.ShareLink;
                                      a.target = "_blank";
                                      document.body.appendChild(a);
                                      a.click();
                                      document.body.removeChild(a); 
                                  } else if (result === "copy") {
                                      // Copy to clipboard 
                                      var linkText = this.getGridData().collection.map[recordId].values.ShareLink;
                                      var tmp = document.createElement("INPUT");
                                      focus = document.activeElement;
                                      tmp.value = linkText;
                                      document.body.appendChild(tmp);
                                      tmp.select();
                                      document.execCommand('copy');
                                      document.body.removeChild(tmp);
                                      focus.focus();
                                  }
                                  }, [{
                                        className: "Terrasoft.Button",
                                        returnCode: "download",
                                        style: Terrasoft.controls.ButtonEnums.style.DEFAULT,
                                        caption: "Download"
                                      }, {
                                        className: "Terrasoft.Button",
                                        returnCode: "view",
                                        style: Terrasoft.controls.ButtonEnums.style.DEFAULT,
                                        caption: "View"
                                      }, {
                                        className: "Terrasoft.Button",
                                        returnCode: "copy",
                                        style: Terrasoft.controls.ButtonEnums.style.DEFAULT,
                                        caption: "Copy URL"
                                      }], this);
                        }
                        return false;
                    
                    
                },
                
                initLoadFilesQueryColumns: function(esq) {
                    this.callParent(arguments);
                    esq.addColumn("[PsgFileLink:PsgFileId].PsgCurrentStorage", "CurrentStorage");
                    esq.addColumn("[PsgFileLink:PsgFileId].PsgShareableLink", "ShareLink");
                
                },
                
                getImageByCurrentStorage: function() {
                
                    var imageUrl = PsgCurrentStorageImageConstants.Icons.DataBase;
                    var storageType = this.get("CurrentStorage");
                    this.console.log("storageType" + storageType.value);
                    if(storageType) {
                        if(storageType.value === "035a52bd-afaa-4f99-898f-ab51f694c1e5") {
                            imageUrl = PsgCurrentStorageImageConstants.Icons.Cloud;
                        }
                    
                    }		
                
                    return imageUrl;
                },
                
                decorateItem: function(item) {
                    this.callParent(arguments);	
                    item.columns["CurrentStorage"] = {
                        caption: "",
                        columnPath: "CurrentStorage",
                        dataValueType: Terrasoft.DataValueType.LOOKUP,
                        isLookup: true,
                        name: "CurrentStorage"
                    };
                
                    item.defGetLookupImageUrlMethod = "getIconByCurrentStorage";
                    item.getIconByCurrentStorage = this.getImageByCurrentStorage;
                },
                 addColumnLink: function(item, column) {
                    const columnPath = column.columnPath;
                    if (columnPath ==="[PsgFileLink:PsgFileId].PsgShareableLink") {
                        column.columnPath = "ShareLink";
                        this.callParent(arguments);
                    } else {
                        this.callParent(arguments);
                    }
                },
    
                deleteRecords: function() {
                    var activeRow = this.getActiveRow();
                    var selectedRows = this.get("SelectedRows");
                    if(this.get("isSPConfigured"))
                        {
                            this.set("Resources.Strings.DeleteConfirmationMessage",
                            this.get("Resources.Strings.DeleteSPConfirmationMessage"));
                        }
                    
                    Terrasoft.showConfirmation(this.get("Resources.Strings.DeleteConfirmationMessage"), function(result) { 
                    var fileArr=[activeRow.values.Id];	
                    var fileIds= selectedRows.length>0 ? selectedRows : fileArr;
                    var scope=this;
                    if (result === Terrasoft.MessageBoxButtons.YES.returnCode) {
                        this.showBodyMask();
                        scope.callService({
                                            serviceName: "PsgSharePointFileApiService",
                                            methodName: "DeleteFileFromSharePoint",
                                            data: {
                                                DetailName: this.entitySchema.name,
                                                FileIds : fileIds	
                                            }
                                        },
                                        function(result) {
                                            this.hideBodyMask();
                                            if (result && result=="Ok") {
                                                scope.removeGridRecords(fileIds);
                                            }
                                            else {
                                                scope.showInformationDialog(scope.get("Resources.Strings.FileNotDeleted"));
                                                scope.removeGridRecords(fileIds);
                                            }
                                        }, scope);
                                    }
                                    
                    }, ["yes", "no"], this);
                
                },
                
                uploadToSPRetryButtonVisible: function() {
                
                    return (!this.get("MultiSelect") && this.get("ActiveRow") != null 
                            && this.get("isSPConfigured"));
                        
                },
                            
                uploadToSPRetry : function()
                {
                    this.showBodyMask();
                    var activeRow=this.getActiveRow();
                    if(activeRow.values.CurrentStorage.value==="035a52bd-afaa-4f99-898f-ab51f694c1e5")
                        {
                            this.showInformationDialog(this.get("Resources.Strings.AlreadyInSP"));
                            this.hideBodyMask();
                            return;
                        }
                    
                        var scope=this;
                        scope.callService({
                                        serviceName: "PsgSharePointFileApiService",
                                            methodName: "RetryUploadToSharePoint",
                                            data: {
                                                FileId: activeRow.get("Id"),
                                                EntitySchemaName : scope.entitySchema.name,
                                                ParentColumnName :scope.get("DetailColumnName") + "Id",
                                                ParentColumnValue :scope.get("MasterRecordId"),
                                                }
                                        },
                                        function(result) {
                                            this.hideBodyMask();
                                            if (result && result=="Ok") {
                                                scope.reloadGridData()
                                                
                                            }
                                            else {
                                            scope.showInformationDialog(result);
                                                 }
                                        }, scope);
            
                },
                /*			
                addToolsButtonMenuItems: function(toolsButtonMenu) {
                    this.callParent(arguments);
                    toolsButtonMenu.addItem(this.getButtonMenuSeparator());
                    toolsButtonMenu.addItem(this.getButtonMenuItem(
                        {
                          Caption: this.get("Resources.Strings.SendEmailButton"),
                          Click: {"bindTo": "onSendEmailButtonClick"},
                          Visible: {"bindTo": "isRecordSelected"}
                        }));
                },
                onSendEmailButtonClick : function()
                {
                    var selectedRows = this.get("SelectedRows");
                    if(selectedRows.length>0)
                    {   
                        var serializedArr = JSON.stringify( selectedRows );
                        var args = {
                            sysProcessName: "PsgEmailAttachments",
                            parameters: {
                                FileIds: serializedArr,
                                Schema: this.entitySchema.name
                            }
                        };
                        Terrasoft.ProcessModuleUtilities.executeProcess(args);
                    }
                },
                */
                isRecordSelected : function()
                {
                    return (this.get("MultiSelect"));
                },
                
            },
            diff: /**SCHEMA_DIFF*/[
                {
                    "operation": "remove",
                    "name": "DataGrid",
                },
                
                {
                    "operation": "insert",
                    "name": "PsgDataGrid",
                    "parentName": "Detail",
                    "propertyName": "items",
                    "index": 0,
                    "values": {
                        "itemType": Terrasoft.ViewItemType.GRID,
                        "listedZebra": true,
                        "collection": {"bindTo": "Collection"},
                        "activeRow": {"bindTo": "ActiveRow"},
                        "primaryColumnName": "Id",
                        "isEmpty": {"bindTo": "IsGridEmpty"},
                        "isLoading": {"bindTo": "IsGridLoading"},
                        "multiSelect": {"bindTo": "MultiSelect"},
                        "selectedRows": {"bindTo": "SelectedRows"},
                        "sortColumn": {"bindTo": "sortColumn"},
                        "sortColumnDirection": {"bindTo": "GridSortDirection"},
                        "sortColumnIndex": {"bindTo": "SortColumnIndex"},
                        "linkClick": {"bindTo": "linkClicked"},
                        "type": "listed",
                        "useListedLookupImages": true,
                        "visible": {
                            "bindTo": "isImageManagerDetailView",
                            "bindConfig": {"converter": "getDataGridVisible"}
                        },
                        "listedConfig": {
                            "name": "DataGridListedConfig",
                            "items": [
                                {
                                    "name": "NameListedGridColumn",
                                    "bindTo": "Name",
                                    "position": {
                                        "column": 0,
                                        "colSpan": 4
                                    },
                                    
                                },
                                {
                                    "name": "VersionListedGridColumn",
                                    "bindTo": "Version",
                                    "position": {
                                        "column": 5,
                                        "colSpan": 2
                                    }
                                },
                                {
                                    "name": "CurrentStorage",
                                    "bindTo": "CurrentStorage",
                                    "position": {
                                        "column": 7,
                                        "colSpan": 7
                                    },
                                    "caption": Resources.localizableStrings.CurrentStorageColumnCaption,
                                
                                },
                                
                                {
                                    "name": "ShareLink",
                                    "bindTo": "ShareLink",
                                    "position": {
                                        "column": 14,
                                        "colSpan": 10
                                    },
                                    "caption": Resources.localizableStrings.Link,
                                    
                                }
                            ]
                        },
                        "tiledConfig": {
                            "name": "DataGridTiledConfig",
                            "grid": {
                                "columns": 24,
                                "rows": 3
                            },
                            "items": [
    
                            ]
                        },
                        "linkClick": {"bindTo": "linkClicked"}
                    }
                },
                
                {
                        "operation": "insert",
                        "parentName": "Header",
                        "propertyName": "items",
                        "name": "Name",
                        "values": {
                            "generator": "HtmlControlGeneratorV2.generateHtmlControl",
                            "htmlContent": {
                                "bindTo": "Name"
                            },
                            "classes": {
                                "wrapClass": ["t-label"]
                            }
                        }
                    },
                {
                    "operation": "insert",
                    "name": "AddToCloudButton",
                    "parentName": "Detail",
                    "propertyName": "tools",
                    "values": {
                        "itemType": Terrasoft.ViewItemType.BUTTON,
                        "tag": "addFileButton",
                        "fileUpload": true,
                        "filesSelected": {"bindTo": "onFileSelect"},
                        "click": {"bindTo": "onAddFileClick"},
                        "visible": {"bindTo": "getAddToCloudButtonVisible"},
                        "imageConfig": {"bindTo": "Resources.Images.AddToCloudButtonImage"},
                         "hint": { "bindTo": "Resources.Strings.AddToCloudToolTip" } ,
                    }
                },
                {
                    "operation": "merge",
                    "name": "AddRecordButton",
                    "parentName": "Detail",
                    "propertyName": "tools",
                    "values": {
                        "itemType": Terrasoft.ViewItemType.BUTTON,
                        "tag": "addFileButton",
                        "fileUpload": true,
                        "filesSelected": {"bindTo": "onFileSelect"},
                        "click": {"bindTo": "onAddFileClick"},
                        "visible": {"bindTo": "getAddRecordButtonVisible"},
                        "imageConfig": {"bindTo": "Resources.Images.AddButtonImage"}
                    }
                },
                {
                    "operation": "insert",
                    "name": "UploadToSPRetry",
                    "parentName": "Detail",
                    "propertyName": "tools",
                    "values": {
                        "itemType": Terrasoft.ViewItemType.BUTTON,
                        "click": {"bindTo": "uploadToSPRetry"},
                        "visible": {"bindTo": "uploadToSPRetryButtonVisible"},
                        "caption": Resources.localizableStrings.UploadToSPRetryButtonCaption
                    }
                },
                
                
                ]
            /**SCHEMA_DIFF*/
        };
    });