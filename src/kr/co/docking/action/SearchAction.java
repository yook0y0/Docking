package kr.co.docking.action;

import java.util.List;

import kr.co.docking.dao.service.GenericService;
import kr.co.docking.dao.serviceImpl.GenericServiceImpl;
import kr.co.docking.vo.ContentVO;
import kr.co.docking.vo.DocumentVO;
import kr.co.docking.vo.EditorCodeVO;
import kr.co.docking.vo.EditorReviewBBSVO;
import kr.co.docking.vo.EditorVO;
import kr.co.docking.vo.MemberContentVO;
import kr.co.docking.vo.MemberVO;
import kr.co.docking.vo.TempVO;

public class SearchAction 
{
	public DocumentVO documentSearch(String documentId) 
	{
		GenericService<DocumentVO>	genericService = new GenericServiceImpl<DocumentVO>();
		return genericService.search("document_search", documentId);
	}
	
	public ContentVO contentSearch(String contentId) 
	{
		GenericService<ContentVO>	genericService = new GenericServiceImpl<ContentVO>();
		return genericService.search("content_search", contentId);
	}
	
	public MemberVO memberSearch(String memberId) 
	{
		GenericService<MemberVO>	genericService = new GenericServiceImpl<MemberVO>();
		return genericService.search("member_search", memberId);
	}
	
	public MemberContentVO	memberContentSearch(String memberId)
	{
		GenericService<MemberContentVO>	genericService = new GenericServiceImpl<MemberContentVO>();
		return genericService.search("memberContent_search", memberId);
	}
	
	public TempVO tempSearch(Integer tempId) 
	{
		GenericService<TempVO>	genericService = new GenericServiceImpl<TempVO>();
		return genericService.search("temp_search", tempId);
	}
	
	public EditorVO editorSearch(String editorId) 
	{
		GenericService<EditorVO>	genericService = new GenericServiceImpl<EditorVO>();
		return genericService.search("editor_search", editorId);
	}
	
	public EditorCodeVO editorCodeSearch(String path) 
	{
		GenericService<EditorCodeVO>	genericService = new GenericServiceImpl<EditorCodeVO>();
		return genericService.search("editorCode_search", path);
	}
	
	public EditorReviewBBSVO editorReviewBBSSearch(String reviewId) 
	{
		GenericService<EditorReviewBBSVO>	genericService = new GenericServiceImpl<EditorReviewBBSVO>();
		return genericService.search("editorReview_search", reviewId);
	}
	
	public List<DocumentVO> documentSearchByWriter(String writer) 
	{
		GenericService<DocumentVO>	genericService = new GenericServiceImpl<DocumentVO>();
		return genericService.searchAll("document_searchAll_key", writer);
	}
	
	public List<ContentVO> contentSearchByDocumentId(String documentId) 
	{
		GenericService<ContentVO>	genericService = new GenericServiceImpl<ContentVO>();
		return genericService.searchAll("content_searchAll_key", documentId);
	}
	
	public List<MemberContentVO> memberContentSearchByDocumentId(String documentId) 
	{
		GenericService<MemberContentVO>	genericService = new GenericServiceImpl<MemberContentVO>();
		return genericService.searchAll("memberContent_searchAll_key", documentId);
	}
	
	public List<MemberContentVO> memberContentSearchByMemberId(String memberId) 
	{
		GenericService<MemberContentVO>	genericService = new GenericServiceImpl<MemberContentVO>();
		return genericService.searchAll("memberContent_searchAll_key", memberId);
	}
	
	public List<TempVO> tempSearchByContentId(String contentId) 
	{
		GenericService<TempVO>	genericService = new GenericServiceImpl<TempVO>();
		return genericService.searchAll("temp_searchAll_key", contentId);
	}
	
	public List<EditorVO> editorSearchByDirector(String director) 
	{
		GenericService<EditorVO>	genericService = new GenericServiceImpl<EditorVO>();
		return genericService.searchAll("editor_searchAll_key", director);
	}	
	
	public List<EditorCodeVO> editorCodeSearchByEditorId(String editorId) 
	{
		GenericService<EditorCodeVO>	genericService = new GenericServiceImpl<EditorCodeVO>();
		return genericService.searchAll("editorCode_searchAll_key", editorId);
	}
	
	public List<EditorReviewBBSVO> editorReviewBBSSearchByEditorId(String editorId) 
	{	
		GenericService<EditorReviewBBSVO>	genericService = new GenericServiceImpl<EditorReviewBBSVO>();
		return genericService.searchAll("editorReview_searchAll_key", editorId);
	}
	
	public List<DocumentVO> documentSearchAll() 
	{
		GenericService<DocumentVO>	genericService = new GenericServiceImpl<DocumentVO>();
		return genericService.searchAll("document_searchAll");
	}
	
	public List<MemberVO> memberSearchAll() 
	{
		GenericService<MemberVO>	genericService = new GenericServiceImpl<MemberVO>();
		return genericService.searchAll("member_searchAll");
	}
	
	public List<MemberContentVO> memberContentSearchAll() 
	{
		GenericService<MemberContentVO>	genericService = new GenericServiceImpl<MemberContentVO>();
		return genericService.searchAll("memberContent_searchAll");
	}
	
	public List<ContentVO> contentSearchAll() 
	{
		GenericService<ContentVO>	genericService = new GenericServiceImpl<ContentVO>();
		return genericService.searchAll("content_searchAll");
	}
	
	public List<EditorVO> editorSearchAll() 
	{
		GenericService<EditorVO>	genericService = new GenericServiceImpl<EditorVO>();
		return genericService.searchAll("editor_searchAll");
	}
	
	public List<EditorReviewBBSVO> editorReviewBBSSearchAll() 
	{
		GenericService<EditorReviewBBSVO>	genericService = new GenericServiceImpl<EditorReviewBBSVO>();
		return genericService.searchAll("editorReview_searchAll");
	}
	
	public List<EditorCodeVO> editorCodeSearchAll() 
	{
		GenericService<EditorCodeVO>	genericService = new GenericServiceImpl<EditorCodeVO>();
		return genericService.searchAll("editorCode_searchAll");
	}
	
	public List<TempVO> tempSearchAll() 
	{
		GenericService<TempVO>	genericService = new GenericServiceImpl<TempVO>();
		return genericService.searchAll("temp_searchAll");
	}
}
