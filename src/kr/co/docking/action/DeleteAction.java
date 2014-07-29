package kr.co.docking.action;

import java.util.List;

import kr.co.docking.dao.service.GenericService;
import kr.co.docking.dao.serviceImpl.GenericServiceImpl;
import kr.co.docking.vo.ContentVO;
import kr.co.docking.vo.DocumentVO;
import kr.co.docking.vo.EditorCodeVO;
import kr.co.docking.vo.EditorReviewBBSVO;
import kr.co.docking.vo.MemberContentVO;
import kr.co.docking.vo.MemberVO;
import kr.co.docking.vo.TempVO;

public class DeleteAction
{
	public void documentDelete(String documentId) 
	{
		GenericService<DocumentVO>	genericService = new GenericServiceImpl<DocumentVO>();
		genericService.delete("document_delete", documentId);
	}
	
	public void contentDelete(String contentId) 
	{
		GenericService<ContentVO>	genericService = new GenericServiceImpl<ContentVO>();
		genericService.delete("content_delete", contentId);
	}
	
	public void contentDeleteByDocumentId(String documentId)
	{
		GenericService<ContentVO>	genericService = new GenericServiceImpl<ContentVO>();
		genericService.delete("content_deleteByDocumentId", documentId);
	}
	
	public void memberDelete(String memberId) 
	{
		GenericService<MemberVO>	genericService = new GenericServiceImpl<MemberVO>();
		genericService.delete("member_delete", memberId);
	}
	
	public void memberContentDeleteByDocumentId(String documentId) 
	{
		GenericService<MemberContentVO>	genericService = new GenericServiceImpl<MemberContentVO>();
		genericService.delete("memberContent_deleteByDocumentId", documentId);
	}
	
	public void memberContentDeleteByMemberId(String memberId)
	{
		GenericService<MemberContentVO>	genericService = new GenericServiceImpl<MemberContentVO>();
		genericService.delete("memberContent_deleteByMemberId", memberId);
	}
	
	public void memberContentDelete(MemberContentVO memberContentVO)
	{
		GenericService<MemberContentVO>	genericService = new GenericServiceImpl<MemberContentVO>();
		genericService.delete("memberContent_delete", memberContentVO);
	}
	
	public void tempDelete(String tempId) 
	{
		GenericService<TempVO>	genericService = new GenericServiceImpl<TempVO>();
		genericService.delete("temp_delete", tempId);
	}
	
	public void editorDelete(String editorId) 
	{
		GenericService<TempVO>	genericService = new GenericServiceImpl<TempVO>();
		genericService.delete("editor_delete", editorId);
	}
	
	public void editorCodeDelete(String path) 
	{
		GenericService<EditorCodeVO>	genericService = new GenericServiceImpl<EditorCodeVO>();
		genericService.delete("editorCode_delete", path);
	}
	
	public void editorCodeDeleteByEditorId(String editorId)
	{
		GenericService<EditorCodeVO>	genericService = new GenericServiceImpl<EditorCodeVO>();
		genericService.delete("editorCode_deleteByEditorId", editorId);
	}
	
	public void editorReviewBBSDelete(String reviewId) 
	{
		GenericService<EditorReviewBBSVO>	genericService = new GenericServiceImpl<EditorReviewBBSVO>();
		genericService.delete("editorReview_delete", reviewId);
	}
	
	public void documentDeleteAll() 
	{
		GenericService<DocumentVO>	genericService = new GenericServiceImpl<DocumentVO>();
		genericService.deleteAll("document_deleteAll");
	}
	
	public void contentDeleteAll() 
	{
		GenericService<ContentVO>	genericService = new GenericServiceImpl<ContentVO>();
		genericService.deleteAll("content_deleteAll");
	}
	
	public void memberDeleteAll() 
	{
		GenericService<MemberVO>	genericService = new GenericServiceImpl<MemberVO>();
		genericService.deleteAll("member_deleteAll");
	}
	
	public void memberContentDeleteAll() 
	{
		GenericService<MemberContentVO>	genericService = new GenericServiceImpl<MemberContentVO>();
		genericService.deleteAll("memberContent_deleteAll");
	}
	
	public void tempDeleteAll() 
	{
		GenericService<TempVO>	genericService = new GenericServiceImpl<TempVO>();
		genericService.deleteAll("temp_deleteAll");
	}
	
	public void editorDeleteAll() 
	{
		GenericService<TempVO>	genericService = new GenericServiceImpl<TempVO>();
		genericService.deleteAll("editor_deleteAll");
	}
	
	public void editorCodeDeleteAll() 
	{
		GenericService<EditorCodeVO>	genericService = new GenericServiceImpl<EditorCodeVO>();
		genericService.deleteAll("editorCode_deleteAll");
	}
	
	public void editorReviewBBSDeleteAll() 
	{
		GenericService<EditorReviewBBSVO>	genericService = new GenericServiceImpl<EditorReviewBBSVO>();
		genericService.deleteAll("editorReview_deleteAll");
	}
	
	public void documentDeleteAll(List<String> list) 
	{
		GenericService<DocumentVO>	genericService = new GenericServiceImpl<DocumentVO>();
		genericService.delete("document_delete",list);
	}
	
	public void contentDeleteAll(List<String> list) 
	{
		GenericService<ContentVO>	genericService = new GenericServiceImpl<ContentVO>();
		genericService.delete("content_delete",list);
	}
	
	public void memberDeleteAll(List<String> list) 
	{
		GenericService<MemberVO>	genericService = new GenericServiceImpl<MemberVO>();
		genericService.delete("member_delete",list);
	}
	
	public void memberContentDeleteAll(List<String> list) 
	{
		GenericService<MemberContentVO>	genericService = new GenericServiceImpl<MemberContentVO>();
		genericService.delete("memberContent_delete",list);
	}
	
	public void tempDeleteAll(List<String> list) 
	{
		GenericService<TempVO>	genericService = new GenericServiceImpl<TempVO>();
		genericService.delete("temp_delete",list);
	}
	
	public void editorDeleteAll(List<String> list) 
	{
		GenericService<TempVO>	genericService = new GenericServiceImpl<TempVO>();
		genericService.delete("editor_delete",list);
	}
	
	public void editorCodeDeleteAll(List<String> list) 
	{
		GenericService<EditorCodeVO>	genericService = new GenericServiceImpl<EditorCodeVO>();
		genericService.delete("editorCode_delete",list);
	}
	
	public void editorReviewBBSDeleteAll(List<String> list) 
	{
		GenericService<EditorReviewBBSVO>	genericService = new GenericServiceImpl<EditorReviewBBSVO>();
		genericService.delete("editorReview_delete",list);
	}
}
