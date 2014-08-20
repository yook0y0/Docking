package org.docking.erbse.service;

import org.docking.erbse.vo.ContentVO;
import org.docking.erbse.vo.EditorExecuteInfoVO;

public interface DockingService {

	public EditorExecuteInfoVO editorTestExecute(String editorId);
	public String editorExecute(ContentVO content);
	public String getEditorCode(String editorId, String path);
}