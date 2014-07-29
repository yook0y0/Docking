package kr.co.docking.service;

import kr.co.docking.vo.EditorCodeVO;
import kr.co.docking.vo.EditorVO;

public interface EditorService {

	public Integer editorAdd(String path, EditorVO editor);
	public Integer editorModify(EditorVO editor);
	public Integer editorDelete(String editorId);
	public String editorSearch(String editorId);
	
	public String ownEditorList(String director);
	
	public Integer editorCodeAdd(EditorCodeVO editorCode);
	public Integer editorCodeModify(EditorCodeVO editorCode);
	public String editorCodeSearch(String path);
	public Integer editorCodeDelete(String path);
	
	public String codeList(String editorId);
}