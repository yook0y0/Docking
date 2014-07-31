package org.docking.erbse.service;

import org.docking.erbse.vo.ContentVO;

public interface DockingService {

	public String editorTestExecute(String editorId);
	public String editorExecute(ContentVO content);
	public String getEditorCode(String editorId, String path);
}