package org.docking.erbse.service;

import org.docking.erbse.vo.ContentVO;

public class DockingServiceImpl implements DockingService 
{

	@Override
	public String editorTestExecute(String editorId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String editorExecute(ContentVO content) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String getEditorCode(String editorId, String path) {
		// TODO Auto-generated method stub
		return null;
	}
	/*@Override
	public String editorTestExecute(String editorId) {
		// TODO Auto-generated method stub
		GenericService<EditorCodeVO>	editCodeService = new GenericServiceImpl<EditorCodeVO>();
		List<EditorCodeVO> ecvoList = editCodeService.searchAll("editorCode_searchAll_key", editorId);

		String code = null;
		for(EditorCodeVO tecvo : ecvoList){
			if(tecvo.getPath().equals(GlobalVariable.EDITOR_START_PAGE)){
				code = tecvo.getCode();
			}
		}

		return code;
	}

	@Override
	public String editorExecute(ContentVO content) {
		// TODO Auto-generated method stub
		GenericService<EditorCodeVO>	editCodeService = new GenericServiceImpl<EditorCodeVO>();
		List<EditorCodeVO> ecvoList = editCodeService.searchAll("editorCode_searchAll_key", content.getEditorId());

		String startCode = null;
		for(EditorCodeVO tecvo : ecvoList){
			if(tecvo.getPath().equals(GlobalVariable.EDITOR_START_PAGE)){
				startCode = tecvo.getCode();
			}
		}

		DockingAnalyzer da = new StringReplaceFilter(new StringRegister(startCode),"src=\"./","src=\"./getEditorCode?editorId=" + content.getEditorId() + "/");

		try {
			da.analyze();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		DataAttribute dAttr = (DataAttribute) da.getAttrSet().get(Attr.ATTRSET_FILE_DATA);

		byte[][] data = dAttr.getData();

		String code = "";
		BufferedInputStream in = new BufferedInputStream(new ByteArrayInputStream(data[0])); 
		int n = 0;
		byte[] buffer = new byte[1024];
		try {
			while((n=in.read(buffer, 0, buffer.length)) != -1) {
				code.concat(new String(buffer,0,n));
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		GenericService<TempVO> tempService = new GenericServiceImpl<TempVO>();
		List<TempVO> tvoList = tempService.searchAll("temp_searchAll_key", content.getContentId());

		TempVO tvo = tvoList.get(tvoList.size());

		String[] objName = {"code","content"};
		return JsonParser.getInstance().jParseObj(objName,new String[]{code,tvo.getContentsBody()});	
	}

	@Override
	public String getEditorCode(String editorId, String path) {
		// TODO Auto-generated method stub
		GenericService<EditorCodeVO>	editCodeService = new GenericServiceImpl<EditorCodeVO>();
		List<EditorCodeVO> ecvoList = editCodeService.searchAll("editorCode_searchAll_key", editorId);

		String oriCode = null;
		for(EditorCodeVO tecvo : ecvoList){
			if(tecvo.getPath().equals(path)){
				oriCode = tecvo.getCode();
			}
		}

		DockingAnalyzer da = new StringReplaceFilter(new StringRegister(oriCode),"src=\"./","src=\"./getEditorCode?editorId=" + editorId + "/");

		try {
			da.analyze();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		DataAttribute dAttr = (DataAttribute) da.getAttrSet().get(Attr.ATTRSET_FILE_DATA);

		byte[][] data = dAttr.getData();

		String code = "";
		BufferedInputStream in = new BufferedInputStream(new ByteArrayInputStream(data[0])); 
		int n = 0;
		byte[] buffer = new byte[1024];
		try {
			while((n=in.read(buffer, 0, buffer.length)) != -1) {
				code.concat(new String(buffer,0,n));
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		String[] objName = {"code"};
		return JsonParser.getInstance().jParseObj(objName,new String[]{code});
	}*/
}
