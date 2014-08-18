package org.docking.erbse.service;

import org.docking.erbse.vo.ContentVO;
import org.docking.erbse.vo.EditorExecuteInfoVO;
import org.docking.erbse.vo.TempVO;

public interface DockingService {

	public EditorExecuteInfoVO editorTestExecute(String editorId);
	public String editorExecute(ContentVO content);
	public String getEditorCode(String editorId, String path);
	
	public String tempAdd(TempVO tempvo);
	public String tempSearch(String tempId);
}