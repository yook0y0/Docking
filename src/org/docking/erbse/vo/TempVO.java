package org.docking.erbse.vo;

import java.io.Serializable;

public class TempVO	implements	Serializable
{
	private static final long serialVersionUID = 1L;
	
	private	Integer	tempId;
	private String	contentId;
	private String	memberId;
	private	String	contentsBody;
	private	String	backUpDate;
	
	public Integer getTempId() {
		return tempId;
	}
	public void setTempId(Integer tempId) {
		this.tempId = tempId;
	}
	public String getContentId() {
		return contentId;
	}
	public void setContentId(String contentId) {
		this.contentId = contentId;
	}
	public String getMemberId() {
		return memberId;
	}
	public void setMemberId(String memberId) {
		this.memberId = memberId;
	}
	public String getContentsBody() {
		return contentsBody;
	}
	public void setContentsBody(String contentsBody) {
		this.contentsBody = contentsBody;
	}
	public String getBackUpDate() {
		return backUpDate;
	}
	public void setBackUpDate(String backUpDate) {
		this.backUpDate = backUpDate;
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((tempId == null) ? 0 : tempId.hashCode());
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
		TempVO other = (TempVO) obj;
		if (tempId == null) {
			if (other.tempId != null)
				return false;
		} else if (!tempId.equals(other.tempId))
			return false;
		return true;
	}
	@Override
	public String toString() {
		return "TempVO [tempId=" + tempId + ", contentId=" + contentId
				+ ", memberId=" + memberId + ", contentsBody=" + contentsBody
				+ ", backUpDate=" + backUpDate + "]";
	}
}
