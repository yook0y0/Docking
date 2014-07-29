package kr.co.docking.service;

import kr.co.docking.vo.ContentVO;
import kr.co.docking.vo.DocumentVO;
import kr.co.docking.vo.MemberContentVO;

public interface DocumentService {

	public Integer documentAdd(DocumentVO document);
	public Integer documentModify(DocumentVO document);
	public Integer documentDelete(String documentId);
	public String documentSearch(String documentId);
	
	public String ownDocumentList(String writer);
	public String joinDocumentList(String memberId);
	
	public Integer contentAdd(ContentVO content);
	public Integer contentModify(ContentVO content);
	public Integer contentDelete(String contentId);
	public String contentSearch(String contentId);
	
	public String contentsList(String documentId);
	
	public Integer memberInvite(MemberContentVO memberContent);
	public Integer memberExpel(MemberContentVO memberContent);
	public Integer memberPositionUpdate(MemberContentVO memberContent);
}