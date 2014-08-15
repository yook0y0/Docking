package org.docking.erbse.service;

import org.docking.erbse.vo.EditorCodeVO;
import org.docking.erbse.vo.EditorExecuteInfoVO;
import org.docking.erbse.vo.EditorVO;

public interface EditorService {

	public Integer editorAdd(String path, EditorVO editor, EditorExecuteInfoVO editorExecuteInfo);
	public Integer editorModify(EditorVO editor, EditorExecuteInfoVO editorExecuteInfo);
	public String editorSearch(String editorId);
	public String editorSearchAll();
	public Integer editorDelete(String editorId);
	
	public String ownEditorList(String director);
	
	public Integer editorCodeAdd(EditorCodeVO editorCode);
	public Integer editorCodeModify(EditorCodeVO editorCode);
	public String editorCodeSearch(String path);
	public Integer editorCodeDelete(String path);
	
	public String codeList(String editorId);
	public String childCodeList(String childId, String editorId);
}