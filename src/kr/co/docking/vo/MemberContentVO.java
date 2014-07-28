package kr.co.docking.vo;

import java.io.Serializable;

public class MemberContentVO	implements	Serializable
{
	private static final long serialVersionUID = 1L;
	
	private String	documentId;
	private	String	memberId;
	
	public String getDocumentId() {
		return documentId;
	}
	public void setDocumentId(String documentId) {
		this.documentId = documentId;
	}
	public String getMemberId() {
		return memberId;
	}
	public void setMemberId(String memberId) {
		this.memberId = memberId;
	}
	
	@Override
	public String toString() {
		return "MemberContentVO [documentId=" + documentId + ", memberId="
				+ memberId + "]";
	}
}
