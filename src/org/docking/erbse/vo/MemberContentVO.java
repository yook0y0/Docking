package org.docking.erbse.vo;

import java.io.Serializable;

public class MemberContentVO	implements	Serializable
{
	private static final long serialVersionUID = 1L;
	
	private String	documentId;
	private	String	memberId;
	private Integer memberPosition;
	
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
	public Integer getMemberPosition(){
		return memberPosition;
	}
	public void setMemberPosition(Integer memberPosition){
		this.memberPosition = memberPosition;
	}
	@Override
	public String toString() {
		return "MemberContentVO [documentId=" + documentId + ", memberId="
				+ memberId + ", memberPosition=" + memberPosition + "]";
	}
}
