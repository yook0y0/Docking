package org.docking.erbse.service;

import java.util.ArrayList;
import java.util.List;

import org.docking.erbse.analysis.DockingAnalyzer;
import org.docking.erbse.analysis.attribute.Attr;
import org.docking.erbse.analysis.attribute.DataAttribute;
import org.docking.erbse.analysis.filter.FileDeleteFilter;
import org.docking.erbse.analysis.filter.FileUnzipFilter;
import org.docking.erbse.analysis.register.FilePathRegister;
import org.docking.erbse.dao.service.GenericService;
import org.docking.erbse.dao.serviceImpl.GenericServiceImpl;
import org.docking.erbse.util.JsonParser;
import org.docking.erbse.vo.EditorCodeVO;
import org.docking.erbse.vo.EditorVO;


public class EditorServiceImpl implements EditorService {

	@Override
	public Integer editorAdd(String path, EditorVO editor) {
		// TODO Auto-generated method stub

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
		editService.add("editor_add", editor);
		
		EditorCodeVO ecvo = new EditorCodeVO();
		List<EditorCodeVO> editorCodeList = new ArrayList<EditorCodeVO>();
		
		for(int i=0;i<data.length;i++){
			ecvo.setEditorId(editor.getEditorId());
			ecvo.setCode(String.valueOf(data[i]));
			ecvo.setPath(editor.getEditorId() + "/" + String.valueOf(type[i]));
			editorCodeList.add(ecvo);
		}
		GenericService<EditorCodeVO>	editCodeService = new GenericServiceImpl<EditorCodeVO>();
		editCodeService.add("editorCode_add", editorCodeList);

		ds = null;
		ds = new FileDeleteFilter(new FilePathRegister(path));
		try {
			ds.analyze();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		Integer res = 0;
		/*
		 * res 값 처리 필요
		 */
		return res;
	}

	@Override
	public Integer editorModify(EditorVO editor) {
		// TODO Auto-generated method stub
		GenericService<EditorVO>	genericService = new GenericServiceImpl<EditorVO>();
		genericService.modify("editor_modify", editor);

		Integer res = 0;
		/*
		 * res 값 처리 필요
		 */
		return res;
	}

	@Override
	public Integer editorDelete(String editorId) {
		// TODO Auto-generated method stub
		GenericService<EditorVO>	editService = new GenericServiceImpl<EditorVO>();
		editService.delete("editor_delete", editorId);

		GenericService<EditorCodeVO>	editCodeService = new GenericServiceImpl<EditorCodeVO>();
		editCodeService.delete("editorCode_deleteByEditorId", editorId);

		Integer res = 0;
		/*
		 * res 값 처리 필요
		 */
		return res;
	}

	@Override
	public String editorSearch(String editorId) {
		// TODO Auto-generated method stub
		GenericService<EditorVO>	genericService = new GenericServiceImpl<EditorVO>();
		EditorVO evo = genericService.search("editor_search", editorId);

		String jRes = null;
		JsonParser.getInstance();
		/*
		 * Json 타입 캐스팅 필요
		 */
		return jRes;
	}

	@Override
	public String ownEditorList(String director) {
		// TODO Auto-generated method stub
		GenericService<EditorVO>	editService = new GenericServiceImpl<EditorVO>();
		List<EditorVO> evoList = editService.searchAll("editor_searchAll_key", director);

		String jRes = null;
		JsonParser.getInstance();
		/*
		 * Json 타입 캐스팅 필요
		 */
		return jRes;
	}

	@Override
	public Integer editorCodeAdd(EditorCodeVO editorCode) {
		// TODO Auto-generated method stub
		GenericService<EditorCodeVO>	editService = new GenericServiceImpl<EditorCodeVO>();
		editService.add("editorCode_add", editorCode);

		Integer res = 0;
		/*
		 * res 값 처리 필요
		 */
		return res;
	}

	@Override
	public Integer editorCodeModify(EditorCodeVO editorCode) {
		// TODO Auto-generated method stub
		GenericService<EditorCodeVO>	genericService = new GenericServiceImpl<EditorCodeVO>();
		genericService.modify("editorCode_modify", editorCode);

		Integer res = 0;
		/*
		 * res 값 처리 필요
		 */
		return res;
	}

	@Override
	public String editorCodeSearch(String path) {
		// TODO Auto-generated method stub
		GenericService<EditorCodeVO>	editCodeService = new GenericServiceImpl<EditorCodeVO>();
		EditorCodeVO ecvo = editCodeService.search("editorCode_search", path);

		String jRes = null;
		JsonParser.getInstance();
		/*
		 * Json 타입 캐스팅 필요
		 */
		return jRes;
	}

	@Override
	public Integer editorCodeDelete(String path) {
		// TODO Auto-generated method stub
		GenericService<EditorCodeVO>	editCodeService = new GenericServiceImpl<EditorCodeVO>();
		editCodeService.delete("editorCode_delete", path);

		Integer res = 0;
		/*
		 * res 값 처리 필요
		 */
		return res;
	}

	@Override
	public String codeList(String editorId) {
		// TODO Auto-generated method stub
		GenericService<EditorCodeVO>	editCodeService = new GenericServiceImpl<EditorCodeVO>();
		List<EditorCodeVO> ecvoList = editCodeService.searchAll("editorCode_searchAll_key", editorId);

		String jRes = null;
		JsonParser.getInstance();
		/*
		 * Json 타입 캐스팅 필요
		 */
		return jRes;
	}
}
