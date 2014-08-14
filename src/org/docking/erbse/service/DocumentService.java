package org.docking.erbse.service;

import org.docking.erbse.vo.ContentVO;
import org.docking.erbse.vo.DocumentVO;
import org.docking.erbse.vo.MemberContentVO;

public interface DocumentService {

	public Integer documentAdd(DocumentVO document, MemberContentVO memberContent);
	public Integer documentModify(DocumentVO document);
	public String documentSearch(String documentId);
	public Integer documentDelete(String documentId);
	
	public String ownDocumentList(String writer);
	public String joinDocumentList(String memberId , String logInMember);
	
	public Integer contentAdd(ContentVO content);
	public Integer contentModify(ContentVO content);
	public String contentSearch(String contentId);
	public Integer contentDelete(String contentId);
	
	public String contentsList(String documentId, String logInMember);
	
	public Integer memberInvite(MemberContentVO memberContent);
	public Integer memberExpel(MemberContentVO memberContent);
	public Integer memberPositionUpdate(MemberContentVO memberContent);
}