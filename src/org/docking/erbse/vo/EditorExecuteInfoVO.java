package org.docking.erbse.vo;

import java.io.Serializable;

public class EditorExecuteInfoVO	implements Serializable 
{
	private static final long serialVersionUID = 1L;
	
	private String	editorId;
	private	String	startPage;
	private	String	setMethod;
	private String	getMethod;
	private Integer	useRange;
	public String getEditorId() {
		return editorId;
	}
	public void setEditorId(String editorId) {
		this.editorId = editorId;
	}
	public String getStartPage() {
		return startPage;
	}
	public void setStartPage(String startPage) {
		this.startPage = startPage;
	}
	public String getSetMethod() {
		return setMethod;
	}
	public void setSetMethod(String setMethod) {
		this.setMethod = setMethod;
	}
	public String getGetMethod() {
		return getMethod;
	}
	public void setGetMethod(String getMethod) {
		this.getMethod = getMethod;
	}
	public Integer getUseRange() {
		return useRange;
	}
	public void setUseRange(Integer useRange) {
		this.useRange = useRange;
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result
				+ ((editorId == null) ? 0 : editorId.hashCode());
		return result;
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		EditorExecuteInfoVO other = (EditorExecuteInfoVO) obj;
		if (editorId == null) {
			if (other.editorId != null)
				return false;
		} else if (!editorId.equals(other.editorId))
			return false;
		return true;
	}
	
	@Override
	public String toString() {
		return "EditorExecuteInfoVO [editorId=" + editorId + ", startPage="
				+ startPage + ", setMethod=" + setMethod + ", getMethod="
				+ getMethod + ", useRange=" + useRange + "]";
	}
}
