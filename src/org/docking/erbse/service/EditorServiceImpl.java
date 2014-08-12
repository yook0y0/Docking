package org.docking.erbse.service;

import java.util.ArrayList;
import java.util.List;

import org.docking.erbse.analysis.DockingAnalyzer;
import org.docking.erbse.analysis.attribute.Attr;
import org.docking.erbse.analysis.attribute.DataAttribute;
import org.docking.erbse.dao.service.GenericService;
import org.docking.erbse.dao.serviceImpl.GenericServiceImpl;
import org.docking.erbse.util.GlobalVariable;
import org.docking.erbse.util.JsonParser;
import org.docking.erbse.vo.EditorCodeVO;
import org.docking.erbse.vo.EditorVO;


public class EditorServiceImpl implements EditorService {

	@Override
	public Integer editorAdd(String path, EditorVO editor) {
		// TODO Auto-generated method stub
/*
		Integer res = 0;
		
		DockingAnalyzer ds = new FileUnzipFilter(new FilePathRegister(path));
		try {
			ds.analyze();
		} catch (Exception e) {
			e.printStackTrace();
		}

		DataAttribute dAttr = (DataAttribute) ds.getAttrSet().get(Attr.ATTRSET_FILE_DATA);

		byte[][] type = dAttr.getType();
		byte[][] data = dAttr.getData();

		GenericService<EditorVO>	editService = new GenericServiceImpl<EditorVO>();
		res += editService.add("editor_add", editor);

		EditorCodeVO ecvo = null;
		List<EditorCodeVO> editorCodeList = new ArrayList<EditorCodeVO>();

		for(int i=0;i<data.length;i++){
			ecvo = new EditorCodeVO();
			ecvo.setEditorId(editor.getEditorId());
			ecvo.setCode(new String(data[i]));
			ecvo.setPath(editor.getEditorId() + "/" + new String(type[i]));
			editorCodeList.add(ecvo);
		}
		GenericService<EditorCodeVO>	editCodeService = new GenericServiceImpl<EditorCodeVO>();
		res = editCodeService.add("editorCode_add", editorCodeList);

		System.out.println("res : " + res);
		
		ds = null;
		ds = new FileDeleteFilter(new FilePathRegister(path));
		try {
			ds.analyze();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return res;
*/	
		return null;	
	}

	@Override
	public Integer editorModify(EditorVO editor) {
		// TODO Auto-generated method stub
		GenericService<EditorVO>	genericService = new GenericServiceImpl<EditorVO>();
		Integer res = genericService.modify("editor_modify", editor);
		
		return res;
	}

	@Override
	public Integer editorDelete(String editorId) {
		// TODO Auto-generated method stub
		Integer res = 0;
		
		GenericService<EditorVO>	editService = new GenericServiceImpl<EditorVO>();
		res = editService.delete("editor_delete", editorId);

		GenericService<EditorCodeVO>	editCodeService = new GenericServiceImpl<EditorCodeVO>();
		res = editCodeService.delete("editorCode_deleteByEditorId", editorId);

		return res;
	}

	@Override
	public String editorSearch(String editorId) {
		// TODO Auto-generated method stub
		GenericService<EditorVO>	genericService = new GenericServiceImpl<EditorVO>();
		EditorVO evo = genericService.search("editor_search", editorId);

		String[] objName = new String[]{"editorVO"};

		/*
		 * DocumentVO Json
		 */
		String jEvo = JsonParser.getInstance().jParseObj(GlobalVariable.EDIT_VO_FIELD, new String[]{evo.getEditorId(),evo.getDirector(),evo.getDescription(),String.valueOf(evo.getEditorType())});

		return JsonParser.getInstance().jParseObj(objName,new String[]{jEvo});
	}
	
	public String editorSearchAll()
	{
		GenericService<EditorVO>	genericService = new GenericServiceImpl<EditorVO>();
		List<EditorVO> eList = genericService.searchAll("editor_searchAll");
		
		List<String> tmpList = new ArrayList<String>();

		String[] objName = new String[]{"editorVO"};
		
		for(EditorVO evo : eList)
		{
			tmpList.add(JsonParser.getInstance().jParseObj(GlobalVariable.EDIT_VO_FIELD, new String[]{evo.getEditorId(),evo.getDirector(),evo.getDescription(),String.valueOf(evo.getEditorType())}));
		}
		
		String[] evoArr = new String[eList.size()];
		evoArr = tmpList.toArray(evoArr);
		String jErvoList = JsonParser.getInstance().jParseArr(evoArr);

		return JsonParser.getInstance().jParseObj(objName,new String[]{jErvoList});
	}

	@Override
	public String ownEditorList(String director) {
		// TODO Auto-generated method stub
		GenericService<EditorVO>	editService = new GenericServiceImpl<EditorVO>();
		List<EditorVO> evoList = editService.searchAll("editor_searchAll_key", director);

		List<String> tmpList = new ArrayList<String>();

		String[] objName = new String[]{"EditorVO"};

		/*
		 * DocumentVO List Json
		 */
		for(EditorVO evo : evoList){
			tmpList.add(JsonParser.getInstance().jParseObj(GlobalVariable.EDIT_VO_FIELD, new String[]{evo.getEditorId(),evo.getDirector(),evo.getDescription(),String.valueOf(evo.getEditorType())}));
		}
		String[] evoArr = new String[evoList.size()];
		evoArr = tmpList.toArray(evoArr);
		String jEvoList = JsonParser.getInstance().jParseArr(evoArr);

		return JsonParser.getInstance().jParseObj(objName,new String[]{jEvoList});
	}

	@Override
	public Integer editorCodeAdd(EditorCodeVO editorCode) {
		// TODO Auto-generated method stub
		GenericService<EditorCodeVO>	editService = new GenericServiceImpl<EditorCodeVO>();
		Integer res = editService.add("editorCode_add", editorCode);

		return res;
	}

	@Override
	public Integer editorCodeModify(EditorCodeVO editorCode) {
		// TODO Auto-generated method stub
		GenericService<EditorCodeVO>	genericService = new GenericServiceImpl<EditorCodeVO>();
		Integer res = genericService.modify("editorCode_modify", editorCode);
		
		return res;
	}

	@Override
	public String editorCodeSearch(String path) {
		// TODO Auto-generated method stub
		GenericService<EditorCodeVO>	editCodeService = new GenericServiceImpl<EditorCodeVO>();
		EditorCodeVO ecvo = editCodeService.search("editorCode_search", path);

		String[] objName = new String[]{"editorCodeVO"};

		/*
		 * DocumentVO Json
		 */
		String jEcvo = JsonParser.getInstance().jParseObj(GlobalVariable.EDITCODE_VO_FIELD, new String[]{ecvo.getEditorId(),ecvo.getCode(),ecvo.getPath()});

		return JsonParser.getInstance().jParseObj(objName,new String[]{jEcvo});
	}

	@Override
	public Integer editorCodeDelete(String path) {
		// TODO Auto-generated method stub
		GenericService<EditorCodeVO>	editCodeService = new GenericServiceImpl<EditorCodeVO>();
		Integer res = editCodeService.delete("editorCode_delete", path);

		return res;
	}

	@Override
	public String codeList(String editorId) {
		// TODO Auto-generated method stub
		GenericService<EditorCodeVO>	editCodeService = new GenericServiceImpl<EditorCodeVO>();
		List<EditorCodeVO> ecvoList = editCodeService.searchAll("editorCode_searchAll_key", editorId);

		List<String> tmpList = new ArrayList<String>();

		String[] objName = new String[]{"EditorCodeVOList"};

		/*
		 * DocumentVO List Json
		 */
		for(EditorCodeVO ecvo : ecvoList){
			tmpList.add(JsonParser.getInstance().jParseObj(GlobalVariable.EDITCODE_VO_FIELD, new String[]{ecvo.getEditorId(),ecvo.getCode(),ecvo.getPath()}));
		}
		String[] ecvoArr = new String[ecvoList.size()];
		ecvoArr = tmpList.toArray(ecvoArr);
		String jEcvoList = JsonParser.getInstance().jParseArr(ecvoArr);

		return JsonParser.getInstance().jParseObj(objName,new String[]{jEcvoList});
	}
}
